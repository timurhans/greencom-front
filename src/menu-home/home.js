import React from 'react';
import axios from 'axios'
import  {api_address }  from '../proxy/proxy.js'
import './home.css';
import { Carousel } from 'primereact/carousel';

const bannersTemplate = (banner) => {
    return (
        <div className="product-item">
            <div className="product-item-content">
                <div className="mb-3">
                <a href={banner.link} ><img src={banner.url_imagem}  className="product-image" /></a>
                </div>
            </div>
        </div>
    );
}


export class Home extends React.Component {
    constructor(props) {
      super(props)
        
      this.state = {
          banners: [],
        }
    }
  
    componentDidMount() {
      this.updateBanners();
      document.title = "Greenish B2B"
    }  
    updateBanners() {

        let url = api_address+'/home'
        axios({
            method: 'GET',
            url: url,
        }).then(res => {
            this.setState({banners: res.data['banners']})
            console.log(this.state.banners)
        })
    }
  
    render() {
        // const lista = this.state.banners.slice()
        // let banners_html = lista.map((val,index) => <a href={val.link}><img src={val.url_imagem}></img></a>)
        return (
            <div>
                <Carousel value={this.state.banners} numVisible={1} numScroll={1} //responsiveOptions={responsiveOptions}
                itemTemplate={bannersTemplate} />
            </div>
        )
    }
}