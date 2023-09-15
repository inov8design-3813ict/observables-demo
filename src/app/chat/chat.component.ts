import { Component,OnInit, signal,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocketsService } from '../services/sockets.service';
import { FormsModule } from '@angular/forms';
import { Msg } from '../msg';
import { AuthService } from '../services/auth.service';
import { User } from '../user';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  currentuser = new User();
  //create signal for values we want to bind to.
  //signals need a default value
  messageout= signal("");
  //messagesin = signal<Msg[]>([]);
  
  messagesin:Msg[] = <Msg[]>[];
  //inject the socket service into the class.
  private socketService = inject(SocketsService);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.initIoConnection();
    this.currentuser = JSON.parse(this.authService.getCurrentuser() || '{}');
    console.log(this.currentuser);
    }

  //Initialise the socket via the service
  private initIoConnection(){
    this.socketService.initSocket();
    // start listening for new messages and updating the messages signal.
    this.socketService.getNewMessage()
    .subscribe((messages:any)=>{
      
        //this.messagesin.set(messages);
        this.messagesin.push(messages);
          
    });
      

  }
    
  chat(){
    if(this.messageout()){
      this.socketService.send(this.messageout());
      this.messageout.set("");
    }else{
      console.log('No Message');
    }
  }
}

