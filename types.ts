import React from 'react';

export interface NavItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

export enum Subject {
  MATH = 'MATH',
  PHYSICS = 'PHYSICS',
  ENGLISH = 'ENGLISH'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

declare global {
  interface Window {
    GGBApplet: any;
    ggbApplet: any;
  }
}