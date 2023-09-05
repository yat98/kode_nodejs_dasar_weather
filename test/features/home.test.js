import supertest from "supertest";
import web from "../../src/app/web.js";
import { JSDOM } from "jsdom";
import 'dotenv/config';

const parseTextFromHtml = (htmlAsString, selector) => {
  const selectedElement = new JSDOM(htmlAsString).window.document.querySelector(selector);
  if(selectedElement !== null){
    return selectedElement.textContent;
  }
  throw new Error(`No element with selector ${selector} found`);
};

const parseAttributeFromHtml = (htmlAsString, selector, attribute) => {
  const selectedElement = new JSDOM(htmlAsString).window.document.querySelector(selector);
  if(selectedElement !== null){
    return selectedElement.getAttribute(attribute);
  }
  throw new Error(`No element with selector ${selector} found`);
};

describe('GET /', () => {
  it('should success get home page', async () => {
    const response = await supertest(web)
      .get('/');
      
    expect(response.status).toBe(200);
    expect(response.get('Content-Type')).toContain('text/html');
  });

  it('should success get city element with empty value', async () => {
    const response = await supertest(web)
      .get('/');

    expect(response.get('Content-Type')).toContain('text/html');
    expect(parseTextFromHtml(response.text, '#city')).toBe('');
  });

  it('should success get get weather button element', async () => {
    const response = await supertest(web)
      .get('/');
      
    expect(response.get('Content-Type')).toContain('text/html');
    expect(parseAttributeFromHtml(response.text, '#get-weather','value')).toBe('Get Weather');
  });
});

describe('POST /', () => {
  it('should success get weather', async () => {
    const response = await supertest(web)
      .post('/')
      .set('Content-Type','application/x-www-form-urlencoded')
      .send({
        city: 'Gorontalo'
      });

    expect(response.status).toBe(200);
    expect(response.get('Content-Type')).toContain('text/html');
    expect(parseAttributeFromHtml(response.text, '#weather','id')).toBe('weather');
  });

  it('should reject get weather if city invalid', async () => {
    const response = await supertest(web)
      .post('/')
      .set('Content-Type','application/x-www-form-urlencoded')
      .send({
        city: '123invalid'
      });

    expect(response.status).toBe(200);
    expect(response.get('Content-Type')).toContain('text/html');
    expect(parseAttributeFromHtml(response.text, '#error','id')).toBe('error');
  });

  it('should reject get weather if token invalid', async () => {
    const currentApiKey = process.env.OPENWEATHER_APIKEY;
    process.env.OPENWEATHER_APIKEY = '123';
    const response = await supertest(web)
      .post('/')
      .set('Content-Type','application/x-www-form-urlencoded')
      .send({
        city: 'gorontalo'
      });

    expect(response.status).toBe(200);
    expect(response.get('Content-Type')).toContain('text/html');
    expect(parseAttributeFromHtml(response.text, '#error','id')).toBe('error');
    
    process.env.OPENWEATHER_APIKEY = currentApiKey;
  });
});