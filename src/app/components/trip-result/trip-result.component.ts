import {
  Component,
  OnInit,
  AfterViewChecked,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AgentService } from '../../services/agent.service';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-trip-result',
  standalone: true,
  imports: [CommonModule, FormsModule, MarkdownModule],
  templateUrl: './trip-result.component.html',
  styleUrls: ['./trip-result.component.scss'],
})
export class TripResultComponent implements OnInit, AfterViewChecked {
  trip: any;
  messages: Array<{ role: 'user' | 'agent'; content: string }> = [];
  userMessage: string = '';
  loading: boolean = false;

  @ViewChild('chatBox') chatBox!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private agentService: AgentService
  ) {}

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
          preferences: preferences,
          itinerary: Array.from(
            { length: Number(params['days']) },
            (_, i) => `Atividade do dia ${i + 1}`
          ),
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
    const formattingInstructions = `
      Responda apenas em **Markdown**, seguindo estas regras:
      - Títulos por dia: \`### Dia 01\`, \`### Dia 02\`
      - Subtítulos por turno: \`#### Manhã\`, \`#### Tarde\`, \`#### Noite\`
      - Listas: \`- Atividade\`
      - Negrito: \`**destaque**\`
      - Links: \`[Nome do lugar](URL)\`
      - Emojis para destacar atrações
      `;

    const initialPrompt = `
      Olá, meu nome é ${this.trip.user}. 
      Meu destino é ${this.trip.destination}, 
      viajarei por ${this.trip.days} dias, 
      e minhas preferências são: ${this.trip.preferences}. 
      Por favor, forneça sugestões e dicas úteis.`;

    this.messages.push({ role: 'user', content: initialPrompt });
    this.loading = true;

    this.agentService
      .sendMessage(`${initialPrompt}\n\n${formattingInstructions}`)
      .subscribe({
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
