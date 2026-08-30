import { Context } from "telegraf";

export enum Step {
    start,
    full_name,
    email,
    contact,
    menu
}

export interface SessionData {
    step: Step
    full_name: string
    email: string
    contact: string
}

export interface BotContext extends Context {
    session: SessionData
}