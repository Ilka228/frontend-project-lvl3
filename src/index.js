import 'bootstrap';
import './styles/main.css';
import { string } from 'yup';


const state = {
    rssForm: {
        isValid: true
    }
}

const validation = (element) => {

   const formIsValid = (element) => {
        if(!state.rssForm.isValid) {
            element.classList.add('invalid');
        } else {
          element.classList.remove('invalid');
        }
    }

    const validate = (input) => {
        let schema = string().matches(/.rss$/).url().nullable();
        schema.isValid(input)
            .then((cb) => state.rssForm.isValid = cb)
            .then(() => console.log(state.rssForm.isValid))
            .then(() => formIsValid(element)); 
    }

    validate(element.value);
    
}

const form = document.createElement('form');

form.innerHTML = `<form class="rss-form"><input type="text" class="rss-form_input" name="input"><input class="rss-form_submit" type="submit" value="Save"></form>`;
document.body.appendChild(form);

const rssForm = document.querySelector('form');
const rssFormInput = rssForm.elements.input;
rssForm.addEventListener('submit', function(e){
    e.preventDefault();
    validation(rssFormInput);
});