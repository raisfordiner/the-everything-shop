import { render } from '@testing-library/react';
import App from './App';
import { describe, it } from 'vitest';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import store from './redux/store';

describe('App', () => {
    it('renders without crashing', () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <App />
                </MemoryRouter>
            </Provider>
        );
    });
});
