import {
  Component,
  OnInit,
  AfterViewChecked,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AgentService } from '../../services/agent.service';
import { MarkdownModule } from 'ngx-markdown';
import { Trip, ChatMessage } from '../../models/trip.model';

@Component({
  selector: 'app-trip-result',
  standalone: true,
  imports: [CommonModule, FormsModule, MarkdownModule],
  templateUrl: './trip-result.component.html',
  styleUrls: ['./trip-result.component.scss'],
})
export class TripResultComponent implements OnInit, AfterViewChecked {
  trip!: Trip;
  messages: ChatMessage[] = [];
  userMessage: string = '';
  loading: boolean = false;

  @ViewChild('chatBox') chatBox!: ElementRef;

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private agentService = inject(AgentService);

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (
        params['destination'] &&
        params['days'] &&
        params['preferences'] &&
        params['user']
      ) {
        let preferences: string[] = [];
        const prefsParam = params['preferences'];
        if (prefsParam) {
          preferences = Array.isArray(prefsParam)
            ? prefsParam
            : prefsParam.split(',').map((p: string) => p.trim());
        }

        this.trip = {
          user: params['user'],
          destination: params['destination'],
          days: Number(params['days']),
          preferences,
        };

        this.sendInitialPrompt();
      }
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      if (this.chatBox) {
        this.chatBox.nativeElement.scrollTop =
          this.chatBox.nativeElement.scrollHeight;
      }
    } catch (err) {}
  }

  sendInitialPrompt() {
    this.loading = true;
    this.agentService.sendTrip(this.trip).subscribe({
      next: (res) => {
        const agentResponse = res.message || 'Sem resposta do agente';
        this.messages.push({ role: 'agent', content: agentResponse });
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  sendMessage() {
    if (!this.userMessage.trim()) return;

    this.messages.push({ role: 'user', content: this.userMessage });
    const messageToSend = this.userMessage;
    this.userMessage = '';
    this.loading = true;

    this.agentService.sendMessage(messageToSend).subscribe({
      next: (res) => {
        const agentResponse = res.message || 'Sem resposta do agente';
        this.messages.push({ role: 'agent', content: agentResponse });
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }
}
