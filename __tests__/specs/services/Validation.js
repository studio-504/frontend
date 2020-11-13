import * as Validation from 'services/Validation'
import { repeat, join, times } from 'ramda'
import API from '@aws-amplify/api'
import * as usersQueries from 'store/ducks/users/queries'

jest.mock('@aws-amplify/api', () => ({
  graphql: jest.fn().mockResolvedValue({ data: { usernameStatus: 'AVAILABLE' } }),
  graphqlOperation: jest.fn().mockResolvedValue(true),
}))

describe('Validation service', () => {
  afterEach(() => {
    API.graphql.mockClear()
    API.graphqlOperation.mockClear()
  })

  describe('Selectors', () => {
    it('getPhone', () => {
      expect(Validation.getPhone({})).toBe('')
      expect(Validation.getPhone({ phone: ' 1232WDEWE4234 ' })).toBe('12324234')
    })

    it('getCountryCode', () => {
      expect(Validation.getCountryCode({})).toBe('+1')
      expect(Validation.getCountryCode({ countryCode: ' Wcsw2 ' })).toBe('2')
    })

    it('getEmail', () => {
      expect(Validation.getEmail({})).toBe('')
      expect(Validation.getEmail({ email: ' VAlid@mail.com ' })).toBe('valid@mail.com')
    })

    it('getUsername', () => {
      expect(Validation.getUsername({})).toBe('')
      expect(Validation.getUsername({ username: ' useRname ' })).toBe('username')
    })

    it('getPassword', () => {
      expect(Validation.getPassword({})).toBe('')
      expect(Validation.getPassword({ password: ' passWord ' })).toBe('passWord')
    })

    it('getConfirmationCode', () => {
      expect(Validation.getConfirmationCode({})).toBe('')
      expect(Validation.getConfirmationCode({ confirmationCode: ' coDe123 ' })).toBe('123')
    })
  })

  describe('Validators', () => {
    it('height', async () => {
      expect(await Validation.height.isValid(undefined)).toBeFalsy()
      expect(await Validation.height.isValid('')).toBeFalsy()
      expect(await Validation.height.isValid('1')).toBeFalsy()
      expect(await Validation.height.isValid('12')).toBeFalsy()
      expect(await Validation.height.isValid(129)).toBeFalsy()
      expect(await Validation.height.isValid(130)).toBeTruthy()
      expect(await Validation.height.isValid(250)).toBeTruthy()
      expect(await Validation.height.isValid(251)).toBeFalsy()
    })

    it('email', async () => {
      expect(await Validation.email.isValid(undefined)).toBeFalsy()
      expect(await Validation.email.isValid('')).toBeFalsy()
      expect(await Validation.email.isValid('1')).toBeFalsy()
      expect(await Validation.email.isValid('12')).toBeFalsy()
      expect(await Validation.email.isValid('valid@mail.com')).toBeTruthy()
      expect(await Validation.email.cast(' trim ')).toBe('trim')
      expect(await Validation.email.isValid('with white space@mail.com')).toBeFalsy()
    })

    it('password', async () => {
      expect(await Validation.password.isValid(undefined)).toBeFalsy()
      expect(await Validation.password.isValid('')).toBeFalsy()
      expect(await Validation.password.isValid('1')).toBeFalsy()
      expect(await Validation.password.isValid('1234567')).toBeFalsy()
      expect(await Validation.password.isValid('12345678')).toBeTruthy()
      expect(await Validation.password.cast(' trim ')).toBe('trim')
    })

    it('confirmationCode', async () => {
      expect(await Validation.confirmationCode.isValid(undefined)).toBeFalsy()
      expect(await Validation.confirmationCode.isValid('')).toBeFalsy()
      expect(await Validation.confirmationCode.isValid('1')).toBeFalsy()
      expect(await Validation.confirmationCode.isValid('12345')).toBeFalsy()
      expect(await Validation.confirmationCode.isValid('1234567')).toBeFalsy()
      expect(await Validation.confirmationCode.isValid('123456')).toBeTruthy()
      expect(await Validation.confirmationCode.isValid('12a456')).toBeFalsy()
      expect(await Validation.confirmationCode.cast(' trim ')).toBe('trim')
    })

    it('phone', async () => {
      expect(await Validation.phone.isValid(undefined)).toBeFalsy()
      expect(await Validation.phone.isValid('')).toBeFalsy()
      expect(await Validation.phone.isValid('1')).toBeFalsy()
      expect(await Validation.phone.isValid('12')).toBeFalsy()
      expect(await Validation.phone.isValid('123sfsdfds')).toBeFalsy()
      expect(await Validation.phone.isValid('123')).toBeTruthy()
      expect(await Validation.phone.isValid(join('', repeat('1', 50)))).toBeTruthy()
      expect(await Validation.phone.isValid(join('', repeat('1', 51)))).toBeFalsy()
      expect(await Validation.phone.isValid('123456789')).toBeTruthy()
      expect(await Validation.phone.cast(' trim ')).toBe('trim')
    })

    it('phoneOrEmail', async () => {
      expect(await Validation.phoneOrEmail.isValid(undefined)).toBeFalsy()
      expect(await Validation.phoneOrEmail.isValid('')).toBeFalsy()
      expect(await Validation.phoneOrEmail.isValid('1')).toBeFalsy()
      expect(await Validation.phoneOrEmail.isValid('12')).toBeFalsy()
      expect(await Validation.phoneOrEmail.isValid('123')).toBeTruthy()
      expect(await Validation.phoneOrEmail.isValid(join('', repeat('1', 50)))).toBeTruthy()
      expect(await Validation.phoneOrEmail.isValid(join('', repeat('1', 51)))).toBeFalsy()
      expect(await Validation.phoneOrEmail.isValid('123456789')).toBeTruthy()
      expect(await Validation.phoneOrEmail.cast(' trim ')).toBe('trim')
    })

    it('username', async () => {
      expect(await Validation.username.isValid(undefined)).toBeFalsy()
      expect(await Validation.username.isValid('')).toBeFalsy()
      expect(await Validation.username.isValid('1')).toBeFalsy()
      expect(await Validation.username.isValid('12')).toBeFalsy()
      expect(await Validation.username.isValid('123')).toBeTruthy()
      expect(await Validation.username.isValid(join('', repeat('a', 50)))).toBeTruthy()
      expect(await Validation.username.isValid(join('', repeat('a', 51)))).toBeFalsy()
      expect(await Validation.username.isValid('abc123')).toBeTruthy()
      expect(await Validation.username.isValid('abc123!@#$%')).toBeFalsy()
      expect(await Validation.username.cast(' trim ')).toBe('trim')
    })

    it('usernameStatusRequest', async () => {
      const username = 'username'
      await Validation.usernameStatusRequest(username)
      expect(API.graphql).toHaveBeenCalled()
      expect(API.graphqlOperation).toHaveBeenCalledWith(usersQueries.usernameStatus, { username })
    })

    it('dateOfBirthMonth', async () => {
      expect(await Validation.dateOfBirthMonth.isValid(undefined)).toBeFalsy()
      expect(await Validation.dateOfBirthMonth.isValid('abc')).toBeFalsy()
      expect(await Validation.dateOfBirthMonth.isValid(-1)).toBeFalsy()
      expect(await Validation.dateOfBirthMonth.isValid(11)).toBeTruthy()
    })

    it('dateOfBirthDay', async () => {
      expect(await Validation.dateOfBirthDay.isValid(undefined)).toBeFalsy()
      expect(await Validation.dateOfBirthDay.isValid('abc')).toBeFalsy()
      expect(await Validation.dateOfBirthDay.isValid(-1)).toBeFalsy()
      expect(await Validation.dateOfBirthDay.isValid(11)).toBeTruthy()
    })

    it('dateOfBirthYear', async () => {
      expect(await Validation.dateOfBirthYear.isValid(undefined)).toBeFalsy()
      expect(await Validation.dateOfBirthYear.isValid('abc')).toBeFalsy()
      expect(await Validation.dateOfBirthYear.isValid(-1)).toBeFalsy()
      expect(await Validation.dateOfBirthYear.isValid(2020)).toBeTruthy()
    })

    it('gender', async () => {
      expect(await Validation.gender.isValid(undefined)).toBeFalsy()
      expect(await Validation.gender.isValid('Female')).toBeTruthy()
    })

    it('fullName', async () => {
      expect(await Validation.fullName.isValid(undefined)).toBeFalsy()
      expect(await Validation.fullName.isValid('Test Fullname')).toBeTruthy()
    })

    it('bio', async () => {
      expect(await Validation.bio.isValid(undefined)).toBeFalsy()
      expect(await Validation.bio.isValid('Test Bio')).toBeTruthy()
    })

    it('matchAgeRangeMin', async () => {
      expect(await Validation.matchAgeRangeMin.isValid(undefined)).toBeFalsy()
      expect(await Validation.matchAgeRangeMin.isValid('abc')).toBeFalsy()
      expect(await Validation.matchAgeRangeMin.isValid(-1)).toBeFalsy()
      expect(await Validation.matchAgeRangeMin.isValid(20)).toBeTruthy()
    })

    it('matchAgeRangeMax', async () => {
      expect(await Validation.matchAgeRangeMax.isValid(undefined)).toBeFalsy()
      expect(await Validation.matchAgeRangeMax.isValid('abc')).toBeFalsy()
      expect(await Validation.matchAgeRangeMax.isValid(-1)).toBeFalsy()
      expect(await Validation.matchAgeRangeMax.isValid(30)).toBeTruthy()
    })

    it('matchLocationRadius', async () => {
      expect(await Validation.matchLocationRadius.isValid(undefined)).toBeFalsy()
      expect(await Validation.matchLocationRadius.isValid('abc')).toBeFalsy()
      expect(await Validation.matchLocationRadius.isValid(-1)).toBeFalsy()
      expect(await Validation.matchLocationRadius.isValid(15)).toBeTruthy()
    })

    it('matchGenders', async () => {
      expect(await Validation.matchGenders.isValid(undefined)).toBeFalsy()
      expect(await Validation.matchGenders.isValid('abc')).toBeTruthy()
    })
  })

  describe('remoteUsernameValidation', () => {
    it('success', async () => {
      API.graphql.mockResolvedValue({ data: { usernameStatus: 'AVAILABLE' } })

      const value = 'value'
      const validate = Validation.remoteUsernameValidation()
      const results = await Promise.all(times(() => validate(value), 10))

      expect(results).toEqual([
        true,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        true,
      ])
      expect(API.graphql).toHaveBeenCalledTimes(2)
    })

    it('not available', async () => {
      API.graphql.mockResolvedValue({ data: { usernameStatus: 'NOT_AVAILABLE' } })

      const value = 'value'
      const validate = Validation.remoteUsernameValidation()
      const results = await Promise.all(times(() => validate(value), 10))

      expect(results).toEqual([
        false,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        false,
      ])
      expect(API.graphql).toHaveBeenCalledTimes(2)
    })

    it('not reject an error on failure request', async () => {
      API.graphql.mockRejectedValue(false)

      const value = 'value'
      const validate = Validation.remoteUsernameValidation()
      const results = await Promise.all(times(() => validate(value), 10))

      expect(results).toEqual([
        true,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        true,
      ])
      expect(API.graphql).toHaveBeenCalledTimes(2)
    })
  })

  describe('Input props', () => {
    it('default', () => {
      expect(Validation.getInputTypeProps(undefined)).toEqual({})
    })

    it('email', () => {
      expect(Validation.getInputTypeProps('email')).toEqual({
        accessibilityLabel: 'email',
        keyboardType: 'email-address',
        textContentType: 'emailAddress',
        autoCompleteType: 'email',
      })
    })

    it('confirmationCode', () => {
      expect(Validation.getInputTypeProps('confirmationCode')).toEqual({
        accessibilityLabel: 'confirmationCode',
        keyboardType: 'number-pad',
        textContentType: 'oneTimeCode',
        autoCompleteType: 'off',
        autoFocus: true,
        maxLength: 6,
      })
    })

    it('password', () => {
      expect(Validation.getInputTypeProps('password')).toEqual({
        accessibilityLabel: 'password',
        secureTextEntry: true,
        keyboardType: 'default',
        textContentType: 'password',
        autoCompleteType: 'password',
      })
    })

    it('username', () => {
      expect(Validation.getInputTypeProps('username')).toEqual({
        accessibilityLabel: 'username',
        keyboardType: 'default',
        textContentType: 'username',
        autoCompleteType: 'username',
      })
    })
  })

  describe('Options', () => {
    it('monthsOptions', () => {
      expect(Validation.monthsOptions).toEqual([
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
      ])
    })

    it('genderOptions', () => {
      expect(Validation.genderOptions).toEqual([
        { label: 'Male', value: 'MALE' },
        { label: 'Female', value: 'FEMALE' },
      ])
    })

    it('locationOptions', () => {
      expect(Validation.locationOptions).toEqual([
        { label: '15 mi', value: 15 },
        { label: '30 mi', value: 30 },
        { label: '50 mi', value: 50 },
        { label: '100 mi', value: 100 },
      ])
    })

    it('datesOptions', () => {
      expect(Validation.datesOptions).toEqual([
        { label: '01', value: '01' },
        { label: '02', value: '02' },
        { label: '03', value: '03' },
        { label: '04', value: '04' },
        { label: '05', value: '05' },
        { label: '06', value: '06' },
        { label: '07', value: '07' },
        { label: '08', value: '08' },
        { label: '09', value: '09' },
        { label: '10', value: '10' },
        { label: '11', value: '11' },
        { label: '12', value: '12' },
        { label: '13', value: '13' },
        { label: '14', value: '14' },
        { label: '15', value: '15' },
        { label: '16', value: '16' },
        { label: '17', value: '17' },
        { label: '18', value: '18' },
        { label: '19', value: '19' },
        { label: '20', value: '20' },
        { label: '21', value: '21' },
        { label: '22', value: '22' },
        { label: '23', value: '23' },
        { label: '24', value: '24' },
        { label: '25', value: '25' },
        { label: '26', value: '26' },
        { label: '27', value: '27' },
        { label: '28', value: '28' },
        { label: '29', value: '29' },
        { label: '30', value: '30' },
        { label: '31', value: '31' },
      ])
    })

    it('yearsOptions', () => {
      expect(Validation.yearsOptions).toEqual([
        { label: '1900', value: '1900' },
        { label: '1901', value: '1901' },
        { label: '1902', value: '1902' },
        { label: '1903', value: '1903' },
        { label: '1904', value: '1904' },
        { label: '1905', value: '1905' },
        { label: '1906', value: '1906' },
        { label: '1907', value: '1907' },
        { label: '1908', value: '1908' },
        { label: '1909', value: '1909' },
        { label: '1910', value: '1910' },
        { label: '1911', value: '1911' },
        { label: '1912', value: '1912' },
        { label: '1913', value: '1913' },
        { label: '1914', value: '1914' },
        { label: '1915', value: '1915' },
        { label: '1916', value: '1916' },
        { label: '1917', value: '1917' },
        { label: '1918', value: '1918' },
        { label: '1919', value: '1919' },
        { label: '1920', value: '1920' },
        { label: '1921', value: '1921' },
        { label: '1922', value: '1922' },
        { label: '1923', value: '1923' },
        { label: '1924', value: '1924' },
        { label: '1925', value: '1925' },
        { label: '1926', value: '1926' },
        { label: '1927', value: '1927' },
        { label: '1928', value: '1928' },
        { label: '1929', value: '1929' },
        { label: '1930', value: '1930' },
        { label: '1931', value: '1931' },
        { label: '1932', value: '1932' },
        { label: '1933', value: '1933' },
        { label: '1934', value: '1934' },
        { label: '1935', value: '1935' },
        { label: '1936', value: '1936' },
        { label: '1937', value: '1937' },
        { label: '1938', value: '1938' },
        { label: '1939', value: '1939' },
        { label: '1940', value: '1940' },
        { label: '1941', value: '1941' },
        { label: '1942', value: '1942' },
        { label: '1943', value: '1943' },
        { label: '1944', value: '1944' },
        { label: '1945', value: '1945' },
        { label: '1946', value: '1946' },
        { label: '1947', value: '1947' },
        { label: '1948', value: '1948' },
        { label: '1949', value: '1949' },
        { label: '1950', value: '1950' },
        { label: '1951', value: '1951' },
        { label: '1952', value: '1952' },
        { label: '1953', value: '1953' },
        { label: '1954', value: '1954' },
        { label: '1955', value: '1955' },
        { label: '1956', value: '1956' },
        { label: '1957', value: '1957' },
        { label: '1958', value: '1958' },
        { label: '1959', value: '1959' },
        { label: '1960', value: '1960' },
        { label: '1961', value: '1961' },
        { label: '1962', value: '1962' },
        { label: '1963', value: '1963' },
        { label: '1964', value: '1964' },
        { label: '1965', value: '1965' },
        { label: '1966', value: '1966' },
        { label: '1967', value: '1967' },
        { label: '1968', value: '1968' },
        { label: '1969', value: '1969' },
        { label: '1970', value: '1970' },
        { label: '1971', value: '1971' },
        { label: '1972', value: '1972' },
        { label: '1973', value: '1973' },
        { label: '1974', value: '1974' },
        { label: '1975', value: '1975' },
        { label: '1976', value: '1976' },
        { label: '1977', value: '1977' },
        { label: '1978', value: '1978' },
        { label: '1979', value: '1979' },
        { label: '1980', value: '1980' },
        { label: '1981', value: '1981' },
        { label: '1982', value: '1982' },
        { label: '1983', value: '1983' },
        { label: '1984', value: '1984' },
        { label: '1985', value: '1985' },
        { label: '1986', value: '1986' },
        { label: '1987', value: '1987' },
        { label: '1988', value: '1988' },
        { label: '1989', value: '1989' },
        { label: '1990', value: '1990' },
        { label: '1991', value: '1991' },
        { label: '1992', value: '1992' },
        { label: '1993', value: '1993' },
        { label: '1994', value: '1994' },
        { label: '1995', value: '1995' },
        { label: '1996', value: '1996' },
        { label: '1997', value: '1997' },
        { label: '1998', value: '1998' },
        { label: '1999', value: '1999' },
        { label: '2000', value: '2000' },
        { label: '2001', value: '2001' },
        { label: '2002', value: '2002' },
      ])
    })

    it('minAgeOptions', () => {
      expect(Validation.minAgeOptions).toEqual([
        { label: '18', value: 18 },
        { label: '19', value: 19 },
        { label: '20', value: 20 },
        { label: '21', value: 21 },
        { label: '22', value: 22 },
        { label: '23', value: 23 },
        { label: '24', value: 24 },
        { label: '25', value: 25 },
        { label: '26', value: 26 },
        { label: '27', value: 27 },
        { label: '28', value: 28 },
        { label: '29', value: 29 },
        { label: '30', value: 30 },
        { label: '31', value: 31 },
        { label: '32', value: 32 },
        { label: '33', value: 33 },
        { label: '34', value: 34 },
        { label: '35', value: 35 },
        { label: '36', value: 36 },
        { label: '37', value: 37 },
        { label: '38', value: 38 },
        { label: '39', value: 39 },
        { label: '40', value: 40 },
        { label: '41', value: 41 },
        { label: '42', value: 42 },
        { label: '43', value: 43 },
        { label: '44', value: 44 },
        { label: '45', value: 45 },
        { label: '46', value: 46 },
        { label: '47', value: 47 },
        { label: '48', value: 48 },
        { label: '49', value: 49 },
        { label: '50', value: 50 },
        { label: '51', value: 51 },
        { label: '52', value: 52 },
        { label: '53', value: 53 },
        { label: '54', value: 54 },
        { label: '55', value: 55 },
        { label: '56', value: 56 },
        { label: '57', value: 57 },
        { label: '58', value: 58 },
        { label: '59', value: 59 },
        { label: '60', value: 60 },
        { label: '61', value: 61 },
        { label: '62', value: 62 },
        { label: '63', value: 63 },
        { label: '64', value: 64 },
        { label: '65', value: 65 },
        { label: '66', value: 66 },
        { label: '67', value: 67 },
        { label: '68', value: 68 },
        { label: '69', value: 69 },
        { label: '70', value: 70 },
        { label: '71', value: 71 },
        { label: '72', value: 72 },
        { label: '73', value: 73 },
        { label: '74', value: 74 },
        { label: '75', value: 75 },
        { label: '76', value: 76 },
        { label: '77', value: 77 },
        { label: '78', value: 78 },
        { label: '79', value: 79 },
        { label: '80', value: 80 },
        { label: '81', value: 81 },
        { label: '82', value: 82 },
        { label: '83', value: 83 },
        { label: '84', value: 84 },
        { label: '85', value: 85 },
      ])
    })

    it('heightOptions', () => {
      expect(Validation.heightOptions).toEqual([
        { label: '130', value: 130 },
        { label: '131', value: 131 },
        { label: '132', value: 132 },
        { label: '133', value: 133 },
        { label: '134', value: 134 },
        { label: '135', value: 135 },
        { label: '136', value: 136 },
        { label: '137', value: 137 },
        { label: '138', value: 138 },
        { label: '139', value: 139 },
        { label: '140', value: 140 },
        { label: '141', value: 141 },
        { label: '142', value: 142 },
        { label: '143', value: 143 },
        { label: '144', value: 144 },
        { label: '145', value: 145 },
        { label: '146', value: 146 },
        { label: '147', value: 147 },
        { label: '148', value: 148 },
        { label: '149', value: 149 },
        { label: '150', value: 150 },
        { label: '151', value: 151 },
        { label: '152', value: 152 },
        { label: '153', value: 153 },
        { label: '154', value: 154 },
        { label: '155', value: 155 },
        { label: '156', value: 156 },
        { label: '157', value: 157 },
        { label: '158', value: 158 },
        { label: '159', value: 159 },
        { label: '160', value: 160 },
        { label: '161', value: 161 },
        { label: '162', value: 162 },
        { label: '163', value: 163 },
        { label: '164', value: 164 },
        { label: '165', value: 165 },
        { label: '166', value: 166 },
        { label: '167', value: 167 },
        { label: '168', value: 168 },
        { label: '169', value: 169 },
        { label: '170', value: 170 },
        { label: '171', value: 171 },
        { label: '172', value: 172 },
        { label: '173', value: 173 },
        { label: '174', value: 174 },
        { label: '175', value: 175 },
        { label: '176', value: 176 },
        { label: '177', value: 177 },
        { label: '178', value: 178 },
        { label: '179', value: 179 },
        { label: '180', value: 180 },
        { label: '181', value: 181 },
        { label: '182', value: 182 },
        { label: '183', value: 183 },
        { label: '184', value: 184 },
        { label: '185', value: 185 },
        { label: '186', value: 186 },
        { label: '187', value: 187 },
        { label: '188', value: 188 },
        { label: '189', value: 189 },
        { label: '190', value: 190 },
        { label: '191', value: 191 },
        { label: '192', value: 192 },
        { label: '193', value: 193 },
        { label: '194', value: 194 },
        { label: '195', value: 195 },
        { label: '196', value: 196 },
        { label: '197', value: 197 },
        { label: '198', value: 198 },
        { label: '199', value: 199 },
        { label: '200', value: 200 },
        { label: '201', value: 201 },
        { label: '202', value: 202 },
        { label: '203', value: 203 },
        { label: '204', value: 204 },
        { label: '205', value: 205 },
        { label: '206', value: 206 },
        { label: '207', value: 207 },
        { label: '208', value: 208 },
        { label: '209', value: 209 },
        { label: '210', value: 210 },
        { label: '211', value: 211 },
        { label: '212', value: 212 },
        { label: '213', value: 213 },
        { label: '214', value: 214 },
        { label: '215', value: 215 },
        { label: '216', value: 216 },
        { label: '217', value: 217 },
        { label: '218', value: 218 },
        { label: '219', value: 219 },
        { label: '220', value: 220 },
        { label: '221', value: 221 },
        { label: '222', value: 222 },
        { label: '223', value: 223 },
        { label: '224', value: 224 },
        { label: '225', value: 225 },
        { label: '226', value: 226 },
        { label: '227', value: 227 },
        { label: '228', value: 228 },
        { label: '229', value: 229 },
        { label: '230', value: 230 },
        { label: '231', value: 231 },
        { label: '232', value: 232 },
        { label: '233', value: 233 },
        { label: '234', value: 234 },
        { label: '235', value: 235 },
        { label: '236', value: 236 },
        { label: '237', value: 237 },
        { label: '238', value: 238 },
        { label: '239', value: 239 },
        { label: '240', value: 240 },
        { label: '241', value: 241 },
        { label: '242', value: 242 },
        { label: '243', value: 243 },
        { label: '244', value: 244 },
        { label: '245', value: 245 },
        { label: '246', value: 246 },
        { label: '247', value: 247 },
        { label: '248', value: 248 },
        { label: '249', value: 249 },
        { label: '250', value: 250 },
      ])
    })

    it('getMaxAgeOptions', () => {
      expect(Validation.getMaxAgeOptions(22)).toEqual([
        { label: '22', value: 22 },
        { label: '23', value: 23 },
        { label: '24', value: 24 },
        { label: '25', value: 25 },
        { label: '26', value: 26 },
        { label: '27', value: 27 },
        { label: '28', value: 28 },
        { label: '29', value: 29 },
        { label: '30', value: 30 },
        { label: '31', value: 31 },
        { label: '32', value: 32 },
        { label: '33', value: 33 },
        { label: '34', value: 34 },
        { label: '35', value: 35 },
        { label: '36', value: 36 },
        { label: '37', value: 37 },
        { label: '38', value: 38 },
        { label: '39', value: 39 },
        { label: '40', value: 40 },
        { label: '41', value: 41 },
        { label: '42', value: 42 },
        { label: '43', value: 43 },
        { label: '44', value: 44 },
        { label: '45', value: 45 },
        { label: '46', value: 46 },
        { label: '47', value: 47 },
        { label: '48', value: 48 },
        { label: '49', value: 49 },
        { label: '50', value: 50 },
        { label: '51', value: 51 },
        { label: '52', value: 52 },
        { label: '53', value: 53 },
        { label: '54', value: 54 },
        { label: '55', value: 55 },
        { label: '56', value: 56 },
        { label: '57', value: 57 },
        { label: '58', value: 58 },
        { label: '59', value: 59 },
        { label: '60', value: 60 },
        { label: '61', value: 61 },
        { label: '62', value: 62 },
        { label: '63', value: 63 },
        { label: '64', value: 64 },
        { label: '65', value: 65 },
        { label: '66', value: 66 },
        { label: '67', value: 67 },
        { label: '68', value: 68 },
        { label: '69', value: 69 },
        { label: '70', value: 70 },
        { label: '71', value: 71 },
        { label: '72', value: 72 },
        { label: '73', value: 73 },
        { label: '74', value: 74 },
        { label: '75', value: 75 },
        { label: '76', value: 76 },
        { label: '77', value: 77 },
        { label: '78', value: 78 },
        { label: '79', value: 79 },
        { label: '80', value: 80 },
        { label: '81', value: 81 },
        { label: '82', value: 82 },
        { label: '83', value: 83 },
        { label: '84', value: 84 },
        { label: '85', value: 85 },
      ])
    })
  })
})
