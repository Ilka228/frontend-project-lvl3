import 'bootstrap';
import './styles/main.css';
import { string } from 'yup';
import i18next from "i18next";
import yup , { setLocale } from 'yup';



const axios = require('axios').default;

const state = {
  rssForm: {
    isValid: null,
    forError: null,
  },
  elements: [],
  streams: [],
};



i18next.init({
  lng: 'ru', 
  debug: false,
  resources: {
    ru: {
      translation: {
        pageTexContent: {

        },
        errors:{
          "not_a_URL": "Ссылка должна быть валидным URL"
        }
      }
    }
  }
});

setLocale({
  string: {
    url: () => ({ key: 'not_a_URL' }),
    nullable: () => ({ key: 'not_a_URL' })
  },
});

// try {
//   await schema.validate({ name: 'jimmy', age: 11 });
// } catch (err) {
//   console.log(err.errors.map((err) => i18next.t(err.key)));
// }


const validation = (element) => {
  
  const formIsValid = (el) => {
    if (!state.rssForm.isValid) {
      el.classList.add('invalid');
    } else {
      el.classList.remove('invalid');
    }
  };

  const valid = (input) => {
    const schema = string().url().defined();
    schema.isValid(input)
      //.catch((err) => console.log(i18next.t(err.key)))
      .then((cb) => { state.rssForm.isValid = cb; })
      .then(() => console.log(state.rssForm.isValid))
      .then(() => formIsValid(element));
  };

  return valid(element.value);
};

const main = document.createElement('main');
main.innerHTML = `


    <div class="modal fade" id="modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel"></h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <h6 class="modal-description"></h6>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary modal-link">Читать Полностью</button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
          </div>
        </div>
      </div>
    </div>
    <section class="rss-section">
      <div class="wrapper">
        <h1>RSS агрегатор</h1>
        <p class="description">Начните читать RSS сегодня! Это легко, это красиво.</p>
        <form class="rss-form">
          <div class="form-group"> 
            <input type="text" class="rss-form_input form-control" name="input" placeholder="RSS link" autocomplete="off">
            <button type="submit" class="btn btn-primary rss-form_submit">Добавить</button>
          </div>
        </form>
        <p class="rss_example">Пример: https://ru.hexlet.io/lessons.rss</p>
        <p></p>
      </wrapper>
    </section>
    <section class="rss-posts">
      <div class='content-wrapper'>
        <div class="rss-posts_content_posts">

        </div>
        <div class="rss-posts_content_feeds">

        </div>
      </div>
    </section>
  
`
document.body.appendChild(main);
const rssForm = document.querySelector('form');
const rssFormInput = rssForm.elements.input;

  

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
  const parse = (doc, url) => {
    const parsedStream = new DOMParser().parseFromString(doc, "application/xml");
    console.log(parsedStream);
    const stream = parsedStream.querySelector('channel');
    const addStream = () => {
      const isStreamInState = state.streams.some((stream) => stream.link === url);
      if(isStreamInState) return;
      else {
        state.streams.push({
          title: stream.querySelector('title').innerHTML,
          description: stream.querySelector('description').innerHTML,
          link: url,
        });
      }
    }
    addStream();
    const items = parsedStream.querySelectorAll('item');
    console.log(items);
    
    items.forEach((item) => {
      const isElementInState = state.elements.some((element) => element.link === item.querySelector('link').innerHTML);
      if(isElementInState) return;
      else {
        state.elements.push({
          link: item.querySelector('link').innerHTML, 
          description: item.querySelector('description').innerHTML,
          title: item.querySelector('title').innerHTML,
        })
      }
    });
    console.log(state.elements);
    console.log(state.streams);
}

const render = () => {
  const rssPosts =  state.elements.reduceRight((posts, post) => 
    posts + 
      `
      <li class="post">
        <a href=${post.link} target="_blank">${post.title}</a>
        <button type="button" class="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modal" data-bs-title='${post.title}' data-bs-description='${post.description}' data-bs-link='${post.link}'>Просмотр</button>
      </li>
      `
  , '');
  const postsContent = `<h2>Посты</h2><ul class="posts">${rssPosts}</ul>`;
  document.querySelector('.rss-posts_content_posts').innerHTML = postsContent;

  const rssFeeds = state.streams.reduceRight((streams, stream) => 
  streams + 
    `
    <li class="feed">
      <p class="feed_title">${stream.title}</p>
      <p class="feed_description">${stream.description}</p>
    </li>
    `
  , '');
  const contentFeeds = `<h2>Фиды</h2><ul class="feeds">${rssFeeds}<ul>`;
  document.querySelector('.rss-posts_content_feeds').innerHTML = contentFeeds;
}
// const url = 'https://ru.hexlet.io/lessons.rss';

//   fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
//   .then(response => {
//     if (response.ok) return response.json();
//     throw new Error('Network response was not ok.');
//   })
//   .then(data => parse(data.contents, url));
  // fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
  // .then(response => {
  //   if (response.ok) return response.json();
  //   throw new Error('Network response was not ok.');
  // })
  // .then(data => parse(data.contents, url));

const query = (url) => {
  fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
  .then(response => {
    if (response.ok) return response.json();
    throw new Error('Network response was not ok.');
  })
  .then(data => parse(data.contents, url))
  .then(() => render());
}
// console.log(rssForm.elements.input.value);
// query(rssFormInput);
  // var doc = parser.parseFromString(data.contents, "application/xml");
  rssForm.addEventListener('submit', (e) => {
    e.preventDefault();
    validation(rssFormInput);
    query(rssFormInput.value);
     
  });
  
  const modal = document.getElementById('modal')
modal.addEventListener('show.bs.modal', function (event) {
  
  var button = event.relatedTarget;
  
  const title = button.getAttribute('data-bs-title');
  const description = button.getAttribute('data-bs-description');
  const link = button.getAttribute('data-bs-link');
  
  const modalTitle = modal.querySelector('.modal-title');
  const modalBody = modal.querySelector('.modal-description');
  const modalLink = modal.querySelector('.modal-link')

  modalTitle.textContent = title;
  modalBody.innerHTML = description;
  modalLink.setAttribute('onclick',`window.open('${link}', '_blank');`);
})