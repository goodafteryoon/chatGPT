const API_KEY = config.apikey;

function genDescription(description) {
  const data = {
    model: 'text-davinci-003',
    suffix: description,
    prompt: `Please use the word in "${description}" to write a more detailed animation-like description Please use the word in input to write a more detailed animation-like description
        in one line of English`,
    n: 4,
  };
  return fetch('https://api.openai.com/v1/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      return data.choices.map((choice) => choice.text);
    });
}

function genImg(description) {
  const data = {
    model: 'image-alpha-001',
    prompt: description,
    num_images: 1,
    size: '256x256',
  };
  fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      document.querySelector('#image').src = data.data[0].url;
    });
}

function onDescriptionClick(event) {
  genImg(event.target.innerText);
}
async function onFormSubmit(event) {
  event.preventDefault();
  const promptText = document.querySelector('input').value;

  const descriptions = await genDescription(promptText);

  const descriptionsElem = document.querySelector('#descriptions');
  descriptionsElem.innerHTML = '';
  descriptions.forEach((description, index) => {
    const li = document.createElement('li');
    description = description.replace(/\n/g, ' '); // 줄바꿈 문자를 공백으로 변환
    li.innerText = `${index + 1}. ${description}`;
    li.addEventListener('click', onDescriptionClick);
    descriptionsElem.appendChild(li);
  });
}
