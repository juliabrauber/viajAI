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
  isSpeaking = false;

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

  shareViaWhatsApp(content: string) {
    const whatsappText = this.convertMarkdownToWhatsApp(content);
    const encodedMessage = encodeURIComponent(whatsappText);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  }

  private convertMarkdownToWhatsApp(text: string): string {
    return text
      .replace(
        /([\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}])/gu,
        ''
      )
      .replace(/<[^>]*>/g, '')
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '$1 ($2)')
      .replace(/^\*(Dia \d{2}|\w+)\*/gm, '*$1*')
      .replace(/\*\*(.*?)\*\*/g, '*$1*')
      .replace(/_(.*?)_/g, '_$1_')
      .replace(/^\s*-\s+/gm, '• ')
      .replace(/~~(.*?)~~/g, '~$1~')
      .replace(/[\u2013\u2014]/g, '-')
      .replace(/\u2026/g, '...')
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"');
  }

  toggleSpeech(text: string): void {
    if (!('speechSynthesis' in window)) {
      alert('Seu navegador não suporta leitura em voz alta.');
      return;
    }

    if (this.isSpeaking) {
      this.stopSpeaking();
    } else {
      this.speakMessage(text);
    }
  }

  private stripMarkdown(markdown: string): string {
    return markdown
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`([^`]*)`/g, '$1')
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      .replace(/#+\s?/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/_(.*?)_/g, '$1')
      .replace(/>\s?/g, '')
      .replace(/[-*]\s+/g, '')
      .replace(/\r?\n|\r/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  speakMessage(text: string): void {
    window.speechSynthesis.cancel();

    const cleanText = this.stripMarkdown(text);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.5;
    utterance.pitch = 1.2;

    const voices = window.speechSynthesis.getVoices();
    const ptFemaleVoice =
      voices.find(
        (v) =>
          (v.lang === 'pt-BR' || v.lang.startsWith('pt')) &&
          /female|mulher|brasil|brasileira/i.test(v.name)
      ) ||
      voices.find((v) => v.lang === 'pt-BR') ||
      voices.find((v) => v.lang.startsWith('pt'));

    if (ptFemaleVoice) {
      utterance.voice = ptFemaleVoice;
      console.log('Usando voz:', ptFemaleVoice.name);
    } else {
      console.warn('Nenhuma voz feminina pt-BR encontrada. Usando padrão.');
    }

    this.isSpeaking = true;
    window.speechSynthesis.speak(utterance);
    utterance.onend = () => {
      this.isSpeaking = false;
    };
  }

  stopSpeaking(): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
    }
  }
}
