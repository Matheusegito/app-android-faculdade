import { render, screen } from '@testing-library/react-native';

import CampoTexto from '../src/componentes/CampoTexto';

test('CampoTexto renderiza o campo de entrada', async () => {
  await render(<CampoTexto placeholder="Digite seu usuário" />);

  expect(screen.getByPlaceholderText('Digite seu usuário')).toBeOnTheScreen();
});
