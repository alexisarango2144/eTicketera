import { transporter } from "../config/mailer.config.js";

let from = process.env.MAIL_FROM;
export class EmailService {
    async #send({to, subject, html}){
        try {
            const info = await transporter.sendMail({from, to, subject, html});
            return info;
        } catch (error) {
            console.error("Error al enviar el email", error);
        }
    }

    async sendTicketConfirmation(user, event, ticket){
        return this.#send({
            to: user.email,
            subject: `Inscripción a evento confirmada: ${event.title} ${ticket.reservationCode}`,
            html: `
                <stong>${ticket.reservationCode}</stong>
                <br>
                <p>Hola ${user.first_name},</p>
                <p>Has confirmado tu inscripción al evento: <strong>${event.title}</strong></p>
                <p>Detalles del ticket:</p>
                <ul>
                    <li>ID: ${ticket.reservationCode}</li>
                    <li>Fecha del evento: ${event.date}</li>
                </ul>
                <br>
                <p>Gracias por participar!</p>
            `
        });
    }

    async sendTicketCancellation(user, event, ticket){
        return this.#send({
            to: user.email,
            subject: `Inscripción a evento cancelada: ${event.title} ${ticket.reservationCode}`,
            html: `
                <stong>${ticket.reservationCode}</stong>
                <br>
                <p>Hola ${user.first_name},</p>
                <p>Has cancelado tu inscripción al evento: <strong>${event.title}</strong></p>
                <p>Detalles del ticket:</p>
                <ul>
                    <li>ID: ${ticket.reservationCode}</li>
                    <li>Fecha de cancelación: ${ticket.cancelledAt}</li>
                </ul>
                <br>
                <p>Gracias por participar!</p>
            `
        });
    }
}