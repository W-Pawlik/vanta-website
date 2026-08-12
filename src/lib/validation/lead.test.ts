import { describe, expect, it } from 'vitest'

import { dictionaryFor } from '@/i18n/dictionaries'

import { LEAD_STEP_COUNT, createLeadSchemas, toFieldErrors } from './lead'

const pl = dictionaryFor('pl').validation
const en = dictionaryFor('en').validation

const schemas = createLeadSchemas(pl)

const validLead = {
  carType: 'suv',
  carModel: 'BMW X3 M40i',
  interests: ['paint', 'ceramic'],
  name: 'Michał',
  phone: '+48 500 100 200',
  email: 'michal@example.com',
  message: 'Auto po zimie, sporo swirli.',
  consent: true,
} as const

describe('lead schema', () => {
  it('accepts a complete submission', () => {
    expect(schemas.full.safeParse(validLead).success).toBe(true)
  })

  it('trims text fields', () => {
    expect(schemas.full.parse({ ...validLead, name: '  Michał  ' }).name).toBe('Michał')
  })

  it('treats blank optional fields as absent rather than empty strings', () => {
    const result = schemas.full.parse({ ...validLead, carModel: '', email: '', message: '' })

    expect(result.carModel).toBeUndefined()
    expect(result.email).toBeUndefined()
    expect(result.message).toBeUndefined()
  })

  it('works without the optional fields at all', () => {
    const { carModel: _carModel, email: _email, message: _message, ...required } = validLead

    expect(schemas.full.safeParse(required).success).toBe(true)
  })

  it('rejects a submission without consent', () => {
    const result = schemas.full.safeParse({ ...validLead, consent: false })

    expect(result.success).toBe(false)
    expect(toFieldErrors(result.error!).consent).toEqual([pl.consent])
  })

  it('reports every invalid field at once', () => {
    const result = schemas.full.safeParse({
      carType: 'spaceship',
      interests: [],
      name: 'M',
      phone: '123',
      consent: true,
    })

    expect(result.success).toBe(false)
    expect(Object.keys(toFieldErrors(result.error!)).sort()).toEqual([
      'carType',
      'interests',
      'name',
      'phone',
    ])
  })
})

describe('localised messages', () => {
  it('uses the messages it was built with', () => {
    const english = createLeadSchemas(en)
    const result = english.step1.safeParse({})

    expect(toFieldErrors(result.error!).carType).toEqual([en.carType])
  })

  it('fills the {max} placeholder in the length message', () => {
    const result = schemas.step3.safeParse({ ...validLead, name: 'x'.repeat(61) })

    expect(toFieldErrors(result.error!).name?.[0]).toBe(pl.maxLength.replace('{max}', '60'))
    expect(toFieldErrors(result.error!).name?.[0]).not.toContain('{max}')
  })
})

describe('phone validation', () => {
  it.each(['500100200', '500 100 200', '+48500100200', '+48 500-100-200', '48 500 100 200'])(
    'accepts %s',
    (phone) => {
      expect(schemas.step3.safeParse({ ...validLead, phone }).success).toBe(true)
    },
  )

  it.each(['12345', '+48 500 100 20', 'pięćset', '', '5001002001234'])('rejects %s', (phone) => {
    expect(schemas.step3.safeParse({ ...validLead, phone }).success).toBe(false)
  })
})

describe('email validation', () => {
  it('rejects a malformed address when one is provided', () => {
    const result = schemas.step3.safeParse({ ...validLead, email: 'michal@' })

    expect(result.success).toBe(false)
    expect(toFieldErrors(result.error!).email).toEqual([pl.email])
  })
})

describe('step schemas', () => {
  it('covers three steps, matching the form progress indicator', () => {
    expect(LEAD_STEP_COUNT).toBe(3)
  })

  it('gates step 1 on the car type only', () => {
    expect(schemas.step1.safeParse({ carType: 'coupe' }).success).toBe(true)
    expect(schemas.step1.safeParse({}).success).toBe(false)
  })

  it('gates step 2 on at least one selected interest', () => {
    expect(schemas.step2.safeParse({ interests: ['advice'] }).success).toBe(true)
    expect(schemas.step2.safeParse({ interests: [] }).success).toBe(false)
  })
})
