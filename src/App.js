import React, { Component } from 'react';
import axios from "axios";
import './App.css';

//APIのエンドポイント（ベースとなるURL）
const ZIPCODE_ENDPOINT = 'https://madefor.github.io/postal-code-api/api/v1/';

class App extends Component {
  constructor(props) {
    super(props);
    //表示する住所をstateとして管理する
    //最初は表示する住所がないため空とする
    this.state = {
      address: ""
    };
  }

  handleGetAddress(event) {
    //フォーム送信時の画面リフレッシュ防止
    event.preventDefault();
    //入力された郵便番号を取得
    const inputZipcode = event.target.ziocode.value;
    //入力された郵便番号をパス（123/4567の形）に変換
    const zipcodeUrl = inputZipcode.slice(0, 3) + "/" + inputZipcode.slice(3);
    //エンドポイント + 郵便番号 + .jsonのURLへaxiosでGETリクエスト
    axios
      .get(ZIPCODE_ENDPOINT + zipcodeUrl + ".json")
      .then(results => {
        //レスポンスを取得
        const data = results.data;
        //レスポンスから日本語の住所を取り出す
        const addressData = data["data"][0]["ja"];
        //住所データから、prefectireとaddress1-4を取り出し、整形する
        const address = addressData["prefecture"] + "\n" + addressData["address1"] + "\n" + addressData["address2"] + "\n" + addressData["address3"] + "\n" + addressData["address4"];
        //整形した住所でstateを更新
        this.setState({
          address: address
        });
      },
      )
      .catch(() => {
        //エラーの場合
        this.setState({
          address: "無効な郵便番号です"
        });
      });

    //入力された郵便番号をリセット
    event.target.reset();
  }

  render() {
    return (
      <div className="App">
        <p className="title">Zip Code Search</p>
        <form className="form" onSubmit={this.handleGetAddress.bind(this)}>
          <input type="text" placeholder="郵便番号" name="ziocode" className="textbox" />
          <input type="submit" value="検索" className="button" />
        </form>
        <p className="address">{this.state.address}</p>
      </div>
    );
  }
}

export default App;
