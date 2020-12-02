import GENDERS, { genderOptions } from 'constants/Genders'

describe('Genders constants', () => {
  it('constants', () => {
    expect(GENDERS.MALE).toBe('MALE')
    expect(GENDERS.FEMALE).toBe('FEMALE')
  })

  it('genderOptions', () => {
    expect(genderOptions).toEqual([
      { label: 'Male', value: 'MALE' },
      { label: 'Female', value: 'FEMALE' },
    ])
  })
})
