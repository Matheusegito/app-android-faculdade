import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

import { observarProdutos } from './produtos';
import { estaComEstoqueBaixo, produtosQueFicaramComEstoqueBaixo } from '../utilitarios/formatacao';

// Notificações locais para o administrador: enquanto ele está logado, o app escuta
// a coleção de produtos em tempo real e avisa quando um produto entra em estoque baixo
// (por exemplo, depois de um professor registrar uma saída).

const CANAL = 'estoque-baixo';

// Mostra a notificação mesmo com o app aberto na tela.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function prepararNotificacoes() {
  // No Android 8+ toda notificação precisa de um canal, criado antes de pedir a permissão.
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CANAL, {
      name: 'Estoque baixo',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }

  const { granted } = await Notifications.requestPermissionsAsync();
  return granted;
}

function notificarEstoqueBaixo(produto) {
  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Estoque baixo',
      body: `${produto.nome} (${produto.tamanho}): ${produto.quantidade} em estoque, mínimo ${produto.quantidadeMinima}.`,
    },
    trigger: { channelId: CANAL }, // dispara na hora
  });
}

// Começa a monitorar e devolve a função que para o monitoramento (usada ao sair).
export function monitorarEstoqueBaixo() {
  let baixosAntes = null; // ids com estoque baixo na leitura anterior (null = primeira leitura)
  let encerrado = false;
  let pararDeObservar = () => {};

  prepararNotificacoes()
    .then((permitido) => {
      if (!permitido || encerrado) return;

      pararDeObservar = observarProdutos((produtos) => {
        // Na primeira leitura só guarda o estado: os produtos que já estavam baixos aparecem no Insights.
        if (baixosAntes) {
          produtosQueFicaramComEstoqueBaixo(baixosAntes, produtos).forEach(notificarEstoqueBaixo);
        }
        baixosAntes = new Set(produtos.filter(estaComEstoqueBaixo).map((p) => p.id));
      });
    })
    .catch(() => console.warn('Não foi possível ativar as notificações de estoque baixo.'));

  return () => {
    encerrado = true;
    pararDeObservar();
  };
}
