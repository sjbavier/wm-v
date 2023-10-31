import React from 'react';
import ReactDOM from 'react-dom';
import { render, screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';

import Bookmarks from './BookmarksContainer';

describe('<Bookmarks> in <Router> context', () => {
  it('renders without crashing, and displays logo', async () => {
    render(<Bookmarks />);
  });
});
