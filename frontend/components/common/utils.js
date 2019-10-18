import moment from 'moment'
import Lockr from 'lockr'
import _ from 'lodash'
import Cookie from 'js-cookie'
import gql from 'graphql-tag'

moment.locale('ru-ru')
const production = process.env.NODE_ENV === 'production'

const utilsMixin = {
  data () {
    return {
      companiesWithVat: ['1', '142'],
      companiesWithoutVat: ['2', '3'],
      VAT_PERCENTAGE: 20,
    }
  },
  methods: {
    mouseUpCheckbox () {
      this.$store.commit('stopSelectFunc')
    },
    mouseDownCheckbox (selected) {
      this.$store.commit('savesStatusOfFirstCheckbox', !selected)
      this.$store.commit('startSelectFunc')
    },
    changeCheckbox ($event, selected) {
      this.$store.commit('startSelectFunc')
      if ($event.buttons === 1 && this.$store.state.isSelected) {
        selected = this.$store.state.statusOfFirstCheckbox
      }
      return selected
    },


    countPages(rowsPerPage, totalItems) {
      if (rowsPerPage == null ||
        totalItems == null
      ) return 0

      return Math.ceil(totalItems / rowsPerPage)
    },

    formatMoney (amount, fixedDigits) {
      if (!amount) {
        amount = 0
      }
      fixedDigits = fixedDigits || 2
      // Округляем до двух знаков после запятой
      return Number(amount).toLocaleString('ru-ru', {
        minimumFractionDigits: fixedDigits,
        maximumFractionDigits: fixedDigits
      })
    },
    formatMoneyEx (amount, currency) {
      if (!amount) {
        amount = 0
      }
      amount = parseFloat(amount)
      return amount.toLocaleString('ru-ru', currency ? {style: 'currency', currency} : {minimumFractionDigits: 2})
    },
    formatProject (projectNum) {
      return this.pad(projectNum, 5)
    },
    formatProjectLong (projectObject, maxLength) {
      if (projectObject && projectObject.number && projectObject.description) {
        maxLength = maxLength || 70
        const result = `${this.formatProject(projectObject.number)} - ${projectObject.description.slice(0, maxLength)}`
        return maxLength < projectObject.description.length ? result + '...' : result
      } else {
        return ''
      }
    },
    formatDate (textDate) {
      if (textDate) {
        return moment(textDate).format('L')
      } else {
        return ''
      }
    },
    formatDateRus (date) {
      let reg = /^(\d{2})\.(\d{2})\.(\d{4}|\d{2})$/
      let str = ''
      if (date) {
        str = date.split(String.fromCharCode(8206)).join('')
        if (reg.test(str)) {
          let isoDate = moment(date, 'DD-MM-YYYY').utc(true).toISOString()
          if (isoDate) {
            return isoDate.substring(0, 10)
          }
        }
      }
      return null
    },
    formatMonth (date) {
      if (date) {
        return moment(date).format('MMMM YYYY')
      } else {
        return ''
      }
    },
    pad (n, width, z) {
      z = z || '0'
      n = n + ''
      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
    },
    formatDateTime (textDateTime) {
      if (textDateTime) {
        return moment(textDateTime).format('L LT')
      } else {
        return ''
      }
    },
    storeValue (name, val) {
      const _name = this.$options.name + '$' + name
      Lockr.set(_name, val)
    },
    getValue (name, emptyVal) {
      const _name = this.$options.name + '$' + name
      return Lockr.get(_name, emptyVal)
    },
    removeValue (name) {
      const _name = this.$options.name + '$' + name
      Lockr.rm(_name)
    },
    generateFilterDates (topMonth) {
      const monthArray = {
        '1': 'Январь',
        '2': 'Февраль',
        '3': 'Март',
        '4': 'Апрель',
        '5': 'Май',
        '6': 'Июнь',
        '7': 'Июль',
        '8': 'Август',
        '9': 'Сентябрь',
        '10': 'Октябрь',
        '11': 'Ноябрь',
        '12': 'Декабрь'
      }
      let start = new Date(2016, 11, 2)
      let now = topMonth ? new Date(Number(topMonth.substr(0, 4)), Number(topMonth.substr(4)) - 1, 1) : new Date()
      now = new Date(now.getFullYear(), now.getMonth() + 1, 1)
      let months = []
      /* eslint-disable no-unmodified-loop-condition */
      while (start < now) {
        const text = monthArray[String(start.getMonth() + 1)] + ' ' + start.getFullYear()
        const id = String(start.getMonth() + 1) + String(start.getFullYear() - 2000)
        months.push({'month': text, 'id': id})
        start.setMonth(start.getMonth() + 1)
      }
      months.reverse()
      return months
    },
    // Функция Вывод списка всех месяцев после месяца secondDate
    generateFilterDatesRange (topMonth, secondDate) {
      const monthArray = {
        '1': 'Январь',
        '2': 'Февраль',
        '3': 'Март',
        '4': 'Апрель',
        '5': 'Май',
        '6': 'Июнь',
        '7': 'Июль',
        '8': 'Август',
        '9': 'Сентябрь',
        '10': 'Октябрь',
        '11': 'Ноябрь',
        '12': 'Декабрь'
      }
      let month = secondDate.length === 3 ? secondDate.substr(0, 1) : secondDate.substr(0, 2)
      let year = secondDate.substr(-2, 2)

      let start = secondDate ? new Date(Number('20' + year), Number(month) - 2, 1) : new Date()
      start = new Date(start.getFullYear(), start.getMonth() + 1, 1)
      let now = topMonth ? new Date(Number(topMonth.substr(0, 4)), Number(topMonth.substr(4)) - 1, 1) : new Date()
      now = new Date(now.getFullYear(), now.getMonth() + 1, 1)
      let months = []
      while (start < now) {
        const text = monthArray[String(start.getMonth() + 1)] + ' ' + start.getFullYear()
        const id = String(start.getMonth() + 1) + String(start.getFullYear() - 2000)
        months.push({'month': text, 'id': id})
        start.setMonth(start.getMonth() + 1)
      }
      months.reverse()
      return months
    },
    // Возвращает месяц и год в Текстовом виде(Пример: "Сентябрь 2017"). Индекс указывает на падеж месяца
    getNameOfDate (date, idx) {
      const monthArray = {
        '1': ['Январь', 'Января'],
        '2': ['Февраль', 'Февраля'],
        '3': ['Март', 'Марта'],
        '4': ['Апрель', 'Апреля'],
        '5': ['Май', 'Мая'],
        '6': ['Июнь', 'Июня'],
        '7': ['Июль', 'Июля'],
        '8': ['Август', 'Августа'],
        '9': ['Сентябрь', 'Сентября'],
        '10': ['Октябрь', 'Октября'],
        '11': ['Ноябрь', 'Ноября'],
        '12': ['Декабрь', 'Декабря']
      }
      if (date === null) {
        let now = new Date()
        return monthArray[String(now.getMonth() + 1)][idx] + ' ' + now.getFullYear()
      } else {
        let month = date.length === 3 ? date.substr(0, 1) : date.substr(0, 2)
        let year = date.substr(-2, 2)
        return monthArray[month][idx] + ' ' + '20' + year
      }
    },
    getMnthByDate (date) {
      return String(date.getMonth() + 1) + String(date.getFullYear() - 2000)
    },
    getDateByMnth (mnth) {
      let month = mnth.length === 3 ? mnth.substr(0, 1) : mnth.substr(0, 2)
      let year = '20' + mnth.substr(-2, 2)
      return new Date(Number(year), Number(month - 1), 2)
    },
    // Принимает дату в формате 20183 и возвращает формат 318
    getIdFromMnth (mnth) {
      mnth = String(mnth)
      return mnth.substr(4) + mnth.substr(2, 2)
    },
    getDefaultFilterDate () {
      return this.generateFilterDates()[0].id
    },
    formatTask (report) {
      const formatOriginalText = function (taskText) {
        if (!taskText) {
          taskText = ''
        }
        const regex = /задача\s+№\s*(\d+)/gui
        let newText = taskText
        let m
        while ((m = regex.exec(taskText)) !== null) {
          if (m.index === regex.lastIndex) {
            regex.lastIndex++
          }
          const url = 'https://synergy34.bitrix24.ru/company/personal/user/0/tasks/task/view/' + m[1] + '/'
          const hint = 'Задача № ' + m[1] + ' в Битрикс24'
          const html = '<a href="' + url + '" title="' + hint + '" target="_blank">' + m[0] + '</a>'
          newText = newText.replace(m[0], html)
        }
        return newText.replace(/\n/g, '<br/>')
      }

      if (report.subProcess) {
        const kind = report.subProcess.kind
        if (kind === 'D') {
          const translateRoots = {D: 'служебн', P: 'личн'}
          let text = 'Передвижение на ' + translateRoots[report.car] + 'ом а/м из "' + report.whereFrom + '" '
          text += 'в "' + report.whereTo + '" (' + String(report.distance).replace('.', ',') + ' км)'
          text += ', используя ' + translateRoots[report.gas] + 'ый бензин.'
          return text
        } else if (kind === 'A') {
          let text = 'Серийный номер: SNGY' + this.pad(report.vcProject, 5) + '.' + this.pad(report.vcDigits, 2) +
            '.' + this.pad(report.vcDigitsMinor, 3)
          text += formatOriginalText('\n' + 'Модель: ' + report.model + '\n' + report.task)
          return text
        } else if (kind === 'P') {
          let text = 'Артикул: SNGY' + this.pad(report.vcProject, 5) + '.' + this.pad(report.vcDigits, 2)
          text += formatOriginalText('\n' + 'Модель: ' + report.model + '\n' + report.task)
          return text
        }
        if (report.workJournalEntries.length > 0) {
          let text = ''
          let sections = new Map()
          report.workJournalEntries.forEach(entry => {
            const key = `${entry.workType} ${entry.section.name}`
            if (sections.has(key)) {
              sections.get(key).push(entry)
            } else {
              sections.set(key, [entry])
            }
          })
          sections = Array.from(sections.entries())
          sections.sort((a, b) => {
            return a[0].localeCompare(b[0])
          })
          for (let section of sections) {
            text += section[0] + '\n'
            for (let entry of section[1]) {
              text += `&nbsp;&nbsp;- ${entry.position}, кол-во ${entry.count}`
              if (entry.place) {
                text += ` ${entry.place}`
              }
              text += '\n'
            }
          }
          return formatOriginalText(text + '\n' + report.task)
        }
      }

      return formatOriginalText(report.task)
    },
    formatURL (url) {
      if (!url) {
        return url
      }
      if (url[0] !== '/') {
        url = '/' + url
      }
      return (production ? '' : '//localhost:8000') + url
    },
    cloneDeep (object) {
      // Uses lodash implementation
      return _.cloneDeep(object)
    },
    createInputObject (object, exclude, flattenInner) {
      exclude = exclude || []
      flattenInner = flattenInner || []
      exclude.push(...flattenInner, '__typename')
      const result = {}
      // Выносим указанные внутренние объекты на верхний уровень
      flattenInner.forEach(key => {
        const innerObject = this.createInputObject(object[key], exclude)
        _.forOwn(innerObject, (value, innerKey) => {
          // Не перезаписывать уже существующие значения
          if (!_.has(object, innerKey)) {
            result[innerKey] = value
          }
        })
      })
      _.forOwn(object, (value, key) => {
        if (exclude.some(item => item === key)) {
          return
        }
        if (Array.isArray(value)) {
          value = value.map(item => this.createInputObject(item, exclude))
        }
        if (_.has(value, '__typename') && _.has(value, 'id')) {
          key = key + 'Id'
          value = value.id
        }
        result[key] = value
      })
      return result
    },
    formatTextWithEllipsis (string, maxLength) {
      return string.length > maxLength ? string.slice(0, maxLength) + '...' : string
    },
    /**
     * Метод расчёта НДС.
     * @param amount: Number сумма от которой будет вычисляться НДС
     * @param vat: Number НДС в процентах
     * @param return_: String выбор выходных данных. With choices:
     * "WV" - amount With Vat возвращать сумму + НДС
     * "VA" - Vat Amount сумму НДС от параметра amount
     * "RO" - Return Object возвращать объект со всеми расчётными данными
     */
    calculateVat (amount, vat, return_) {
      vat = vat || this.VAT_PERCENTAGE
      return_ = return_ || 'RO'
      const vatAmount = amount * vat / 100
      const amountWithVat = amount + vatAmount
      if (return_ === 'WV') {
        return amountWithVat
      } else if (return_ === 'VA') {
        return vatAmount
      } else if (return_ === 'RO') {
        return {
          vat: vat,
          amount: amount,
          vatAmount: vatAmount,
          amountWithVat: amountWithVat
        }
      }
    },
    /**
     * Неточное сравнение двух значений 'Почти равны'. Сравнение производится
     * посредством сравнения модуля разности сравниваемых с дельтой.
     * @param first первое значение для сравнения
     * @param second второе значение для сравнения
     * @param places количество знаков после запятой with defaults 7
     * @param delta необходимая точность сравнения with defaults 0.1
     * @return Boolean
     */
    almostEqual (first, second, places, delta) {
      places = places || 7
      delta = delta || 0.1
      let diff = +Math.abs(first - second).toFixed(places)
      return diff <= delta
    },
    /**
     * Парсинг 1с-виписки из банка
     * ! ИСПОЛЬЗОВАТЬ С ПРЕВИКСОМ await !
     * Пример: let x = await parse1cFile(...)
     * @param file: файл полученный компонентом <input/>
     * @return Object
     */
    parse1cFile (file) {
      return this.apolloSimulator.mutate({
        mutation: gql`
        mutation ($input: Parser1CFileInput!) {
          parser1cFile (input: $input) {
            json
          }
        }`,
        variables: {input: {}},
        files: {
          file: file
        }
      }).then(({data}) => {
        return JSON.parse(data.data.parser1cFile.json)
      })
    },
    isStorageTitle (properties) {
      return `Минимально поддерживаемое количество: ` +
        `${properties.minSupportedAmount}${properties.keepingUnit.shortName} на ${properties.keepingLocation.name}. \n` +
        `Закупаемые партии: по ${properties.purchasesBatch}${properties.keepingUnit.shortName}`
    },
    /**
     * Проверка контрольный цифр у ИНН.
     * @param {String} INN ИНН контрагента
     * @param {Number} countNumber Количество чисел в ИНН. (10 - юр. лицо, 12 - физ. лицо)
     * @return {Boolean} Результат проверки
     */
    checkControlNumbersInINN (INN, countNumber) {
      INN = INN || ''
      let inn = INN.split('').map(letter => parseInt(letter))

      if (countNumber === 10) {
        let coeff = [2, 4, 10, 3, 5, 9, 4, 6, 8]
        let sum = 0
        _.range(9).forEach(index => {
          sum += coeff[index] * inn[index]
        })
        let controlNumber = (sum % 11) % 10
        return controlNumber === inn[9]
      }

      if (countNumber === 12) {
        let coeffOne = [7, 2, 4, 10, 3, 5, 9, 4, 6, 8]
        let coeffTwo = [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8]

        let sum = 0
        _.range(10).forEach(index => {
          sum += coeffOne[index] * inn[index]
        })
        let controlNumberOne = (sum % 11) % 10

        sum = 0
        _.range(11).forEach(index => {
          sum += coeffTwo[index] * inn[index]
        })
        let controlNumberTwo = (sum % 11) % 10

        return controlNumberOne === inn[10] && controlNumberTwo === inn[11]
      }
      return false
    },
    /**
     * Округление до большего.
     * @param {Number} number округляемое число
     * @param {Number} numberCountAfterComma Количество округляемых чисел после запятой
     * @return {Number} Результат округления
     */
    ceil (number, numberCountAfterComma) {
      numberCountAfterComma = numberCountAfterComma || 0
      numberCountAfterComma = Math.pow(10, numberCountAfterComma)
      number = Math.floor(1000*number)/1000
      return Math.ceil(number * numberCountAfterComma) / numberCountAfterComma
    },

    // Фокус экрана на элементе
    scrollToElement (elementId) {
      /**
       * @elementId: ID элемента для центрирования экрана(верх элемента)
       **/
      document.getElementById(elementId).scrollIntoView({block: 'start', behavior: 'smooth'})
    },
    copyToBuffer (text) {
      /**
       * Сопирование текста в буффер
       * @text: текст для копирования
       **/
      this.$copyText(text).then(t => {
        this.$notify({
          group: 'commonNotification',
          duration: 2000,
          text: `Текст скопирован: ${t.text}`
        })
      })
    },
    addCopyingContextMenuFields (items) {
      /**
       * Добавляет поля в контекстное меню копирования
       * @items: куда добавлять эти поля
       **/
      items.forEach(req => {
        this.$set(req, 'copyToBufferMenuField', false)
      })
    },
    showCopyingContextMenu (e, item, everyItem) {
      /**
       * Показать меню
       * @e: $event
       **/
      e.preventDefault()
      this.showMenu = false
      this.x = e.clientX
      this.y = e.clientY
      everyItem.forEach(req => {
        req.copyToBufferMenuField = false
      })
      this.$nextTick(() => {
        item.copyToBufferMenuField = true
      })
    },
    getContentTextByClick (e) {
      return e.target.innerText
    },
    /**
     * Получение глобального параметра
     * @param {String} name имя параметра
     * @param {String, null} date дата, на которую хотим узнать значение параметра. При null - сегоднящняя дата
     * @return {Number} Значение параметра
     **/
    getGlobalSetting(name, date) {
      return this.$apollo.query({
        query: gql`
          query ($name:String!, $date:String) {
            getGlobalSetting(name:$name, date:$date) {
              id
              name
              value
            }
          }
        `,
        variables: {
          name: name,
          date: date
        },
      }).then(({data}) => {
        return data.getGlobalSetting
      })
    }
  }
}

export default utilsMixin
