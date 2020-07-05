class InputValidator {
    constructor(input, validFilter,  pasteFilter) {
        input.addEventListener('change', this.validate);
        input.addEventListener('focus', this.onFocus);
        input.addEventListener('paste', this.onPaste);

        this.input = input;
        this.validFilter = validFilter;
        this.pasteFilter = pasteFilter;
        this.isValid = true
    }

    validate = () => {
        this.isValid = this.validFilter.test(this.input.value);
        if (!this.isValid) {
            this.input.classList.add('input-invalid');
        }

        return this.isValid;
    };

    onPaste = (event) => {
        event.preventDefault();

        const str = event.clipboardData.getData('text/plain');
        this.input.value = str.replace(this.pasteFilter,'');
    };

    onFocus = () => {
        if (!this.isValid) {
            this.input.classList.remove('input-invalid');
            this.isValid = true;
        }
    }
}

class Main {
    constructor() {
        this.formElem = document.forms.contacts;
        this.formElem.addEventListener('submit', this.onSubmit);

        const { name, email, phone } = this.formElem.elements;
        this.validators = [];

        const nameValidator = new InputValidator(
            name,
            /^[А-Я][а-я]+\s[А-Я][а-я]+\s[А-Я][а-я]+$/,
            /[^А-Яа-я\s]/g,
        );
        this.validators.push(nameValidator);

        const emailValidator = new InputValidator(
            email,
            /^[a-z0-9]+(?!.*(?:\+{2,}|-{2,}|\.{2,}))(?:[.+\-]?[a-z0-9])*@gmail\.com$/,
            /[^a-z0-9.+\-@]/g,
        );
        this.validators.push(emailValidator);

        const phoneValidator = new InputValidator(
            phone,
            /^(\+7|8|07)+\d{10}$/,
            /[^\d+]/g,
        );
        this.validators.push(phoneValidator);
    }

    allInputsValid() {
        const result = this.validators.map(validator => validator.validate());
        return !result.includes(false);
    }

    onSubmit = (event) => {
        event.preventDefault();

        if (!this.allInputsValid()) {
            return;
        }

        const { name, email, phone } = this.formElem.elements;
        const data = {
            name: name.value,
            email: email.value,
            phone: phone.value,
        };
        console.dir(data);

        // this.send();
    };

    async send() {
        try {
            const response = await fetch('', {
                method: 'POST',
                body: new FormData(this.formElem),
            });
            if (!response.ok) {
                throw new Error('Response !== ok');
            }

            const result = await response.json(); // Предположим что в ответе json
        } catch (error) {
            console.log('Network error occurred: ', error.message);
        }
    }
}

new Main();
