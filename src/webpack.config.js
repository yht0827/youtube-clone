const path = require('path'); // 전체 경로를 사용하기위해
const autoprefixer = require('autoprefixer');
const ExtractCSS = require('extract-text-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

const MODE = process.env.WEBPACK_ENV;
const ENTRY_FILE = path.resolve(__dirname, 'assets', 'js', 'main.js'); // assets/js/main.js파일을 의미
const OUTPUT_DIR = path.join(__dirname, 'static'); // dirname : 현재 프로젝트의 디렉토리 이름
const config = {
  entry: ['@babel/polyfill', ENTRY_FILE], // entry : 파일들이 어디에서 왔는지
  mode: MODE, // develop인지 production 인지 설정
  module: {
    rules: [
      {
        test: /\.(js)$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.(scss)$/, // test 규칙에 맞는 파일이면 use아래의 플러그인을 사용하는 한다.
        use: ExtractCSS.extract([
          // 순서는 맨 밑에서 부터
          {
            loader: 'css-loader' // webpack이 css를 이해 할 수 있게 해준다. 잘 호환되는 순수한 css가 불러와지면 우리는 딱 그부분만 추출해서 어디로 보냄
          },
          {
            loader: 'postcss-loader', // css를 받아서 우리가 주는 plugin을 받아서 css로 변환(css호환성 관련 해결[익스플로어 연결같은 문제들])
            options: {
              plugins() {
                return [autoprefixer()];
              }
            }
          },
          {
            loader: 'sass-loader' // sass 또는 scss 파일을 css로 바꿔줌
          }
        ])
      }
    ]
  },
  output: {
    // output: 파일들을 어디에다 넣을 지
    path: OUTPUT_DIR,
    filename: '[name].js'
  },
  plugins: [new CaseSensitivePathsPlugin(), new ExtractCSS('styles.css')] // 실제 만들어질 css파일명
};

module.exports = config;
