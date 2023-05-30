import { Component, OnInit } from '@angular/core';

import { Configuration, OpenAIApi } from "openai";

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Ask the book';
  messageArray = [{name: '', message: ''}];
  message:string= '';

 configuration = new Configuration({
    apiKey: environment.OPEN_AI_API_KEY,
  });
 openai = new OpenAIApi(this.configuration);

  ngOnInit(): void {
    this.messageArray.push({name:'bot', message: 'How may I help you?'});
  }

  async sendMessage(){
    const data = { message:this.message };
    this.messageArray.push({name:'you', message:this.message});
    this.sendToGPT(this.message);
    this.message = '';
  
  }

  async sendToGPT(userPrompt: string) {
    console.log('hello:'+userPrompt);
    try {
      const completion = await this.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [ {"role": "user", "content": userPrompt} ]
      });
      console.log(completion.data.choices[0].message);
      this.messageArray.push({name:'bot', message: ''+completion.data.choices[0].message?.content});
    } catch (err: any) {
      
    }
  }
    
}
