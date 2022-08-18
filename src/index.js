import 'bootstrap';
import './styles/main.css';
import { string } from 'yup';


const state = {
    rssForm: {
        isValid: true
    }
}

const validation = (element) => {

    const validate = (input) => {
        let schema = string().matches(/.rss$/).url().nullable();
        schema.isValid(input).then((cb) => state.rssForm.isValid = cb); 
    }

    validate(element.value);
    console.log(state.rssForm.isValid);

    const formIsValid = (element) => {
        if(!state.rssForm.isValid) {
            element.classList.add('invalid');
        } else {
          element.classList.remove('invalid');
        }
    }
    formIsValid(element);
}

const form = document.createElement('form');
const rssFormInput = document.querySelector('.rss-form_input');
form.innerHTML = `<form class="rss-form"><input type="text" class="rss-form_input"><input class="rss-form_submit" type="submit" value="Save"></form>`;
document.body.appendChild(form);

const rssForm = document.querySelector('form');
rssForm.addEventListener('submit', function(e){
    e.preventDefault();
    validation(rssFormInput);
});