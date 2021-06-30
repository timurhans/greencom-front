import React from 'react';
import axios from 'axios'


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

        let url = 'http://localhost:3000/home'
        axios({
            method: 'GET',
            url: url,
        }).then(res => {
            this.setState({banners: res.data})
            console.log(this.state.banners)
        })
    }
  
    render() {
        const lista = this.state.banners.slice()
        let banners_html = lista.map((val,index) => <a href={val.url}><img src={val.img}></img></a>)
        return (
            <div>
                {banners_html}
            </div>
        )
    }
}