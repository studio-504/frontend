export const genderOptions = [
  { label: 'Male', value: 'MALE' },
  { label: 'Female', value: 'FEMALE' },
]

export const locationOptions = [
  { label: '5 mi', value: 5 },
  { label: '15 mi', value: 15 },
  { label: '30 mi', value: 30 },
  { label: '50 mi', value: 50 },
  { label: '100 mi', value: 100 },
]

export const monthsOptions = [
  { label: 'January', value: '01' },
  { label: 'February', value: '02' },
  { label: 'March', value: '03' },
  { label: 'April', value: '04' },
  { label: 'May', value: '05' },
  { label: 'June', value: '06' },
  { label: 'July', value: '07' },
  { label: 'August', value: '08' },
  { label: 'September', value: '09' },
  { label: 'October', value: '10' },
  { label: 'November', value: '11' },
  { label: 'December', value: '12' },
]

export const datesOptions = Array.from({ length: 31 }, (_, i) => {
  const value = `${i + 1}`.padStart(2, '0')

  return { label: value, value }
})

export const yearsOptions = Array.from({ length: 103 }, (_, i) => {
  const value = `${i + 1900}`

  return { label: value, value }
})

export const minAgeOptions = Array.from({ length: 68 }, (_, i) => {
  const value = i + 18

  return { label: `${value}`, value }
})

export const getMaxAgeOptions = (matchAgeRangeMin) => {
  return Array.from({ length: 68 + 18 - matchAgeRangeMin }, (_, i) => {
    const value = i + matchAgeRangeMin

    return { label: `${value}`, value }
  })
}

const zeroToNine = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
export const heightOptions = zeroToNine.reduce((acc, feet) => {
  zeroToNine.forEach((inches) => {
    const label = `${feet}'${inches}"`
    const value = (feet * 12 + inches) * 2.54

    acc.push({ label, value })
  })

  return acc
}, []).slice(1)
