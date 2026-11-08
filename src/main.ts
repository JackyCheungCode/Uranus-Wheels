import { mount } from 'svelte';
import App from './App.svelte';
import './styles/design-tokens.css';
import './app.css';
import './bimmerz-overrides.css';

mount(App, { target: document.getElementById('app')! });
