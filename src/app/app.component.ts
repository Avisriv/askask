import { Component, OnInit } from '@angular/core';

import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from "openai";

import { environment, initialPrompt } from '../../environments/environment';

import * as CryptoJS from "crypto-js";

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
    apiKey: CryptoJS.AES.decrypt(environment.MY_VALUE, environment.MY_VAL).toString(CryptoJS.enc.Utf8),
  });
 openai = new OpenAIApi(this.configuration);

  ngOnInit(): void {
    this.messageArray.push({name:'bot', message: 'How may I help you?'});
    this.sendToGPT(initialPrompt, "system");
  }

  async sendMessage(){
    const data = { message:this.message };
    this.messageArray.push({name:'you', message:this.message});
    const promptEngineered = "Just like the above prompt and combination, please help me in this new situation: \n"+ this.message + "\n"+
"In case you can\'t reference the above prompt and response combination, say \'Unexpected Error, please contact support\'."
    this.sendToGPT(promptEngineered);
    this.message = '';
  
  }

  myMessages: Array<ChatCompletionRequestMessage> = []

  async sendToGPT(userPrompt: string, myRole = "user") {
    console.log('hello:'+userPrompt);
    const role = myRole
    try {
      this.myMessages.push( {"role": "user", "content": userPrompt} )
      const completion = await this.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: this.myMessages as Array<ChatCompletionRequestMessage>
      });
      console.log(completion.data.choices[0].message);
      this.messageArray.push({name:'bot', message: ''+completion.data.choices[0].message?.content});
     
      
    } catch (err: any) {
      
    }
  }
    
}
