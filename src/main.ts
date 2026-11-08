import { mount } from 'svelte';
import App from './App.svelte';
import './app.css';
import './bimmerz-overrides.css';

mount(App, { target: document.getElementById('app')! });
