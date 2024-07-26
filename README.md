# Midas - Scrapper

Este projeto faz parte do trabalho da disciplina de Arquitetura de Backend do curso de pós-graduação em Desenvolvimento Web FullStack da PUC Minas. Trata de um tópico, fila e função lambda a serem executados na AWS para fazer o scrapping (raspagem) dos dados de uma NFC-e do estado de Minas Gerais por meio de uma URL capturada à partir da leitura do QR code impresso no cupom fiscal dado aos consumidores no momento da compra. Os dados capturados são então enviados para um novo [tópico](https://github.com/RicardoGPP/dwfs-abeol2-midas-save-data-lambda) responsável pela persistência no banco de dados.

## Principais arquivos do projeto

 - [template.yaml](https://github.com/RicardoGPP/dwfs-abeol2-midas-scrapper-lambda/blob/main/template.yaml): Descreve os recursos a serem provisionados na AWS;
 - [app.mjs](https://github.com/RicardoGPP/dwfs-abeol2-midas-scrapper-lambda/blob/main/hello-world/app.mjs): Faz a tratativa de eventos de scrapping;
 - [scrapper.mjs](https://github.com/RicardoGPP/dwfs-abeol2-midas-scrapper-lambda/blob/main/hello-world/src/scrapper.mjs): Faz o scrapping dos dados à partir da página de uma NFC-e;
 - [sns-publisher.mjs](https://github.com/RicardoGPP/dwfs-abeol2-midas-scrapper-lambda/blob/main/hello-world/src/sns-publisher.mjs): Publica uma mensagem com os dados da NFC-e no tópico de salvamento no banco;
 - [geolocalization-service.mjs](https://github.com/RicardoGPP/dwfs-abeol2-midas-scrapper-lambda/blob/main/hello-world/service/geolocalization-service.mjs): Faz a busca da latitude e longitude à partir de um CEP;
 - [nfce-service.mjs](https://github.com/RicardoGPP/dwfs-abeol2-midas-scrapper-lambda/blob/main/hello-world/service/nfce-service.mjs): Recupera a página da web referente à URL de uma NFC-e.

## Funcionamento

O processo de scrapping tem a função de recuperar os dados de uma NFC-e e então enviá-los a um novo tópico para salvamento no banco. Esta é a primeira etapa do sistema **Midas**, que tem por objetivo ser um indexador de preços de forma a ajudar o usuário a decidir onde fazer suas compras com base em um histórico de compras já realizadas por outros usuários.
