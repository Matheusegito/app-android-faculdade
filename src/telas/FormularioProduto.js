import { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import Botao from '../componentes/Botao';
import CampoTexto from '../componentes/CampoTexto';
import SeletorOpcoes from '../componentes/SeletorOpcoes';
import { AcessoNegado } from '../componentes/Avisos';
import { adicionarProduto, editarProduto } from '../servicos/produtos';
import { ehAdministrador } from '../servicos/autenticacao';
import { useSessao } from '../contexto/SessaoContexto';
import { categorias } from '../dados/dadosProdutos';
import { cores } from '../utilitarios/cores';
import { avisarErroDeConexao } from '../utilitarios/erros';

// Serve tanto para cadastrar quanto para editar.
// Se vier um produto pelos parâmetros da navegação, a tela entra em modo de edição.
export default function FormularioProduto({ navigation, route }) {
  const { usuario } = useSessao();
  const produtoEditado = route.params?.produto;

  const [nome, setNome] = useState(produtoEditado?.nome ?? '');
  const [categoria, setCategoria] = useState(produtoEditado?.categoria ?? categorias[0]);
  const [tamanho, setTamanho] = useState(produtoEditado?.tamanho ?? '');
  const [quantidade, setQuantidade] = useState(String(produtoEditado?.quantidade ?? ''));
  const [quantidadeMinima, setQuantidadeMinima] = useState(String(produtoEditado?.quantidadeMinima ?? ''));
  const [preco, setPreco] = useState(produtoEditado?.preco ? String(produtoEditado.preco).replace('.', ',') : '');
  const [foto, setFoto] = useState(produtoEditado?.foto ?? null);
  const [salvando, setSalvando] = useState(false);

  if (!ehAdministrador(usuario)) {
    return <AcessoNegado />;
  }

  async function escolherFoto() {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!resultado.canceled) {
      setFoto(resultado.assets[0].uri);
    }
  }

  async function salvar() {
    const qtd = parseInt(quantidade, 10);
    const qtdMinima = parseInt(quantidadeMinima, 10);
    const valor = preco ? parseFloat(preco.replace(',', '.')) : null;

    if (!nome.trim() || !tamanho.trim()) {
      Alert.alert('Atenção', 'Preencha o nome e o tamanho do produto.');
      return;
    }
    if (isNaN(qtd) || qtd < 0 || isNaN(qtdMinima) || qtdMinima < 0) {
      Alert.alert('Atenção', 'Informe quantidades válidas (números inteiros, 0 ou mais).');
      return;
    }
    if (preco && (isNaN(valor) || valor < 0)) {
      Alert.alert('Atenção', 'Informe um preço válido.');
      return;
    }

    const dados = {
      nome: nome.trim(),
      categoria,
      tamanho: tamanho.trim(),
      quantidade: qtd,
      quantidadeMinima: qtdMinima,
      preco: valor,
      foto,
    };

    setSalvando(true);
    try {
      if (produtoEditado) {
        await editarProduto(produtoEditado.id, dados);
      } else {
        await adicionarProduto(dados);
      }
      navigation.goBack();
    } catch (erro) {
      avisarErroDeConexao('salvar o produto');
      setSalvando(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.areaFoto} onPress={escolherFoto}>
          {foto ? (
            <Image source={{ uri: foto }} style={styles.foto} />
          ) : (
            <View style={[styles.foto, styles.semFoto]}>
              <Ionicons name="camera-outline" size={32} color={cores.textoSecundario} />
            </View>
          )}
          <Text style={styles.textoFoto}>{foto ? 'Trocar foto' : 'Escolher foto da galeria'}</Text>
        </TouchableOpacity>

        <CampoTexto rotulo="Nome" placeholder="Ex.: Kimono Branco" value={nome} onChangeText={setNome} />

        <Text style={styles.rotulo}>Categoria</Text>
        <SeletorOpcoes opcoes={categorias} selecionada={categoria} aoSelecionar={setCategoria} />
        <View style={{ height: 8 }} />

        <CampoTexto rotulo="Tamanho" placeholder="Ex.: A2, M, Único" value={tamanho} onChangeText={setTamanho} />

        <View style={styles.linha}>
          <View style={styles.metade}>
            <CampoTexto
              rotulo="Quantidade"
              placeholder="0"
              keyboardType="number-pad"
              value={quantidade}
              onChangeText={setQuantidade}
            />
          </View>
          <View style={styles.metade}>
            <CampoTexto
              rotulo="Quantidade mínima"
              placeholder="0"
              keyboardType="number-pad"
              value={quantidadeMinima}
              onChangeText={setQuantidadeMinima}
            />
          </View>
        </View>

        <CampoTexto
          rotulo="Preço (opcional)"
          placeholder="Ex.: 489,90"
          keyboardType="decimal-pad"
          value={preco}
          onChangeText={setPreco}
        />

        <Botao
          titulo={produtoEditado ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR PRODUTO'}
          onPress={salvar}
          carregando={salvando}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  conteudo: {
    padding: 20,
    paddingBottom: 50,
  },
  areaFoto: {
    alignItems: 'center',
    marginBottom: 20,
  },
  foto: {
    width: 110,
    height: 110,
    borderRadius: 14,
  },
  semFoto: {
    backgroundColor: cores.branco,
    borderWidth: 1,
    borderColor: cores.borda,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoFoto: {
    color: cores.vermelho,
    fontWeight: '600',
    marginTop: 8,
  },
  rotulo: {
    fontSize: 13,
    fontWeight: '600',
    color: cores.texto,
    marginBottom: 6,
  },
  linha: {
    flexDirection: 'row',
    marginHorizontal: -6,
  },
  metade: {
    flex: 1,
    marginHorizontal: 6,
  },
});
