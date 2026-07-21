# Mini WhatsApp

Proyecto académico: chat que envía/recibe mensajes reales de WhatsApp (via
`whatsapp-web.js`, sin necesitar credenciales pagas de Meta), construido con
**Arquitectura Hexagonal**, **DDD** y principios **SOLID**.

## Cómo correrlo

```bash
npm install
cp .env.example .env
npm start
```

Abrí `http://localhost:3000`. Por defecto `MESSAGING_ADAPTER=mock`, así que
podés usar la app sin WhatsApp real:

```bash
# Simula que tu compañero te escribe:
curl -X POST http://localhost:3000/api/simulate-incoming \
  -H "Content-Type: application/json" \
  -d '{"from":"+50688882222","to":"+50688881111","text":"hola!"}'
```

### Conectar tu WhatsApp real

1. En `.env` poné `MESSAGING_ADAPTER=whatsapp`
2. `npm start`
3. Abrí `http://localhost:3000`, esperá el QR y escaneálo desde
   WhatsApp > Dispositivos vinculados en tu celular.
4. Ahora los mensajes que envíes desde la app salen por tu WhatsApp real,
   y lo que te escriban tus compañeros llega a la conversación.

No necesitás cuenta de negocio ni token de Meta: `whatsapp-web.js` automatiza
tu sesión de WhatsApp Web, como cuando vinculás una compu.

## Por qué está organizado así (Arquitectura Hexagonal)

```
src/
  domain/            <- reglas de negocio puras, sin Express ni WhatsApp
    entities/          Message, Contact
    value-objects/     PhoneNumber, MessageContent
    repositories/      MessageRepositoryPort   (puerto)
    services/          MessagingGatewayPort    (puerto)
  application/        <- casos de uso, orquestan el dominio
    use-cases/         SendMessageUseCase, ReceiveMessageUseCase, GetConversationUseCase
  infrastructure/     <- detalles técnicos (adaptadores de los puertos)
    adapters/
      messaging/        MockMessagingAdapter, WhatsAppWebAdapter
      repositories/      InMemoryMessageRepository
    http/               Express: server, rutas, controllers
    config/             container.js (composition root / inyección de dependencias)
public/              <- frontend Vanilla JS/HTML (el "otro lado" del hexágono)
```

La idea central: `domain/` y `application/` **no importan nada de Express ni
de whatsapp-web.js**. Solo conocen los *puertos* (interfaces). Quien decide
qué adaptador concreto usar es `container.js`, en un único lugar. Por eso
podés pasar de `mock` a `whatsapp` real cambiando una variable de entorno,
sin tocar un caso de uso.

## Dónde está cada principio SOLID

- **S — Single Responsibility**: cada caso de uso hace una sola cosa
  (`SendMessageUseCase` solo envía; `MessageController` solo traduce HTTP).
- **O — Open/Closed**: podés agregar un adaptador nuevo (ej. la API oficial
  de Meta) implementando `MessagingGatewayPort`, sin modificar
  `SendMessageUseCase`.
- **L — Liskov Substitution**: `MockMessagingAdapter` y `WhatsAppWebAdapter`
  son intercambiables porque ambos cumplen el mismo contrato.
- **I — Interface Segregation**: `MessagingGatewayPort` y
  `MessageRepositoryPort` son puertos chicos y específicos, no una interfaz
  gigante con métodos que nadie usa.
- **D — Dependency Inversion**: los casos de uso reciben los puertos por
  constructor (inyección de dependencias) y `container.js` es el único que
  conoce las clases concretas.

## Dónde está DDD

- **Entidades** (`Message`, `Contact`): tienen identidad (`id`) y ciclo de
  vida (`markAsSent`, `markAsFailed`).
- **Value Objects** (`PhoneNumber`, `MessageContent`): inmutables, se
  comparan por valor, y validan sus propias reglas en el constructor.
- **Ports** como límite explícito entre el dominio y el mundo exterior.
- **Casos de uso** en `application/` como la capa que orquesta el dominio
  para cumplir una intención concreta del usuario.

## Siguientes pasos posibles

- Cambiar `InMemoryMessageRepository` por uno con SQLite/Postgres (mismo
  puerto, otro adaptador).
- Agregar un `RegisterContactUseCase` para guardar compañeros con nombre.
- Agregar WebSockets en vez de polling para mensajes en tiempo real.
