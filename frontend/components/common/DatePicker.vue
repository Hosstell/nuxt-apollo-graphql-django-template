<template>
  <div style="display: flex; justify-content: flex-start; align-items: center;">
    <v-text-field
      :label="label"
      v-model="formattedDate"
      :clearable="clearable && !readonly"
      :required="required"
      :disabled="disabled"
      :prepend-icon="showIcon"
      :rules="notValidField"
      :readonly="readonly"
      :hide-details="hideDetails"
      :placeholder="placeholder"
      :solo="solo"
      @focus="focus" @blur="blur"
      append-icon="search"
      @click:append="openMenu"
      return-masked-value
      mask="##.##.####"
      ref="textField"
      :class="{ 'pt-0': noTopPadding, 'mt-0': noTopPadding }"
      :name="name"
    />

    <v-menu
      ref="menu" lazy v-model="menu" transition="scale-transition" :close-on-content-click="false"
      offset-y full-width :nudge-left="290" max-width="290px" min-width="290px" :disabled="disabled || readonly"
    >
      <span slot="activator"></span>
      <v-date-picker
        v-model="internalDate" locale="ru-ru" :first-day-of-week="1"
        :allowed-dates="allowedDates" no-title scrollable @input="$refs.menu.save(internalDate)"
      />
    </v-menu>
  </div>
</template>

<script>
  import utilsMixin from './utils'

  export default {
    name: 'DatePicker',
    props: {
      value: String,
      allowedDates: Function,
      rules: {
        type: Array,
        default: function () {
          return []
        }
      },
      label: String,
      icon: {
        type: String,
        default: 'event'
      },
      required: Boolean,
      disabled: Boolean,
      readonly: Boolean,
      clearable: Boolean,
      hideIcon: Boolean,
      noTopPadding: Boolean,
      hideDetails: Boolean,
      placeholder: String,
      solo: Boolean,
      name: name
    },
    mixins: [utilsMixin],
    data () {
      return {
        menu: false,
        internalDate: this.value,
        textInternalDate: null,
        textFieldFocused: false,
        isCalendarClicked: false,
        manualError: false,
        notValidField: [
          text => {
            if (this.required && !this.formattedDate) {
              this.$emit('isDateValid', false)
              return 'Поле не может быть пустым'
            }
            if (this.formattedDate && !this.isEqual(text)) {
              this.$emit('isDateValid', false)
              return 'Неправильный формат'
            } else {
              this.$emit('isDateValid', true)
              return true
            }
          },
          this.isAllowedDates,
          ...this.rules
        ]
      }
    },
    watch: {
      value: function (val) {
        this.internalDate = val
      },
      internalDate: function (val) {
        // Нужно для замены текста в поле при выборе даты из календаря
        // Или если поле заполняется из вне. Как например в отсутствиях сотрудников.
        if (this.isCalendarClicked || !this.textFieldFocused) {
          if (this.internalDate) {
            this.textInternalDate = new Date(this.internalDate).toLocaleDateString('ru-ru')
          } else {
            this.textInternalDate = null
          }
          this.isCalendarClicked = false
        }
        this.$emit('input', val)
      },
      required () {
        this.$refs.textField.validate()
      }
    },
    methods: {
      openMenu () {
        this.menu = true
        this.isCalendarClicked = true
        this.$emit('focus')
      },
      isAllowedDates () {
        if (this.internalDate && this.allowedDates && !this.allowedDates(this.internalDate)) {
          return 'Дата невозможна'
        }
        return true
      },
      isEqual (text) {
        return !!(this.formatDateRus(text) && this.internalDate === this.formatDateRus(text))
      },
      // Функция превращающая печатный ввод в дату
      writtenDate (val) {
        val = val.replace(',', '.')
        let date = this.formatDateRus(val)
        this.textInternalDate = val
        if (date) {
          this.internalDate = date
        }
      },
      blur () {
        this.textFieldFocused = false
        if (this.internalDate) {
          const date = new Date(this.internalDate)
          this.textInternalDate = date.toLocaleDateString('ru-ru')
        } else {
          this.textInternalDate = null
        }
        this.$emit('blur')
      },
      focus (event) {
        if (!this.internalDate) {
          var date = this.formatDate(new Date())
          this.internalDate = date.split('.').reverse().join('-')
          this.$nextTick(() => {
            event.target.select()
          })
        }
        this.textFieldFocused = true
        this.$emit('focus')
      },
      resetValidation () {
        this.$refs.textField.reset()
      }
    },
    computed: {
      showIcon () {
        if (!this.hideIcon) {
          return this.icon
        }
      },
      formattedDate: {
        get () {
          if (!this.textInternalDate) {
            if (this.internalDate) {
              const date = new Date(this.internalDate)
              return date.toLocaleDateString('ru-ru')
            } else {
              return null
            }
          }
          return this.textInternalDate
        },
        set (value) {
          if (!value) {
            this.$nextTick(() => {
              this.internalDate = null
            })
          } else {
            if (this.isCalendarClicked) {
              this.isCalendarClicked = false
            }
            this.writtenDate(value)
          }
        }
      }
    }
  }
</script>
