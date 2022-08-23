import 'bootstrap';
import './styles/main.css';
import { string } from 'yup';
import parse from './js/hello.js';

const axios = require('axios').default;

const state = {
  rssForm: {
    isValid: true,
    forError: null,
  },
};

const validation = (element) => {
  
  const formIsValid = (el) => {
    if (!state.rssForm.isValid) {
      el.classList.add('invalid');
    } else {
      el.classList.remove('invalid');
    }
  };

  const validate = (input) => {
    const schema = string().matches(/rss/).url().nullable();
    schema.isValid(input)
      .then((cb) => { state.rssForm.isValid = cb; })
      .then(() => console.log(state.rssForm.isValid))
      .then(() => formIsValid(element));
  };

  validate(element.value);
};

const formSection = document.createElement('header');
formSection.classList.add('header');
const form = document.createElement('form');
form.innerHTML = `
    <form class="rss-form">
      <div class="form-group"> 
        <input type="text" class="rss-form_input form-control" name="input" placeholder="RSS link" autocomplete="off">
        <button type="submit" class="btn btn-primary rss-form_submit">Добавить</button>
      </div>
      <small id="emailHelp" class="form-text text-muted">Example: https://ru.hexlet.io/lessons.rss</small>
      <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
    </form>`;

document.body.appendChild(formSection);
const section = document.querySelector('.header');
section.appendChild(form);


const rssForm = document.querySelector('form');
const rssFormInput = rssForm.elements.input;
rssForm.addEventListener('submit', (e) => {
  e.preventDefault();
  validation(rssFormInput);
});
  

  // axios({
  //   method: 'get',
  //   url: 'http://rss.dw.de/xml/rss-ru-news',
  //   withCredentials: false,
  // })
  // .then(function (response) {
  //   console.log(response.data);
  // });
  
  // axios({
  //   method: 'get',
  //   headers: {"Access-Control-Allow-Origin": "*"},
  //   url: 'http://rss.dw.de/xml/rss-ru-news',
  // }).then(function (response) {
  //   console.log(response.data);
  // });
 
  fetch(`https://allorigins.hexlet.app/get?&url=${encodeURIComponent('http://rss.dw.de/xml/rss-ru-news')}`)
  .then(response => {
    if (response.ok) return response.json();
    throw new Error('Network response was not ok.');
  })
  .then(data => parse(data.contents));


  // var doc = parser.parseFromString(data.contents, "application/xml");