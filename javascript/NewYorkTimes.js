
            
            class Page extends React.Component{

                //konstruktor klase Page definise kako ce klasa biti instancirana
                //definise niz 'urls' - kolekcija web linkova
                //impelmentira metodu onSuccess koja ce biti automatksi pozvana kada Wweb api vrati success code
                constructor(props){
                    super(props)
                    this.state = {                        
                        urls: [],                        
                        year: new Date().getFullYear(),
                        month: new Date().getMonth()+1,
                        selectedUrl: {
                            web_url: '',
                                headline: {
                                    main: ''
                                },                            
                            byline: {
                                original: ''
                                },
                            pub_date: '',
                            source: '',
                            word_count:''
                            }
                    };   

                    this.onSuccess = this.onSuccess.bind(this);                      
                    this.handleChangeYear = this.handleChangeYear.bind(this);
                    this.handleChangeMonth = this.handleChangeMonth.bind(this);                    
                    this.handleClick = this.handleClick.bind(this);
                    this.handleSubmit = this.handleSubmit.bind(this);                    
                    this.years = this.years.bind(this);
                    this.months = this.months.bind(this);
                }      
                
                //handler za click event na image
                handleClick(item){
                    this.setState({selectedUrl: item})
                    this.setState({showDetail: true})
                }

                //handler za change event za select box 'year'
                handleChangeYear(event){
                   this.setState({year: event.target.value});
                }                
                
                //handler za select box month picker (drop down list)
                handleChangeMonth(event){
                    this.setState({month: event.target.value});
                 }
                
                //handler za form submit
                handleSubmit(event, prevState){                    
                    event.preventDefault();
                    
                    
                    $.ajax({
                        type   : "GET",
                        url    : "https://api.nytimes.com/svc/archive/v1/" + this.state.year+ "/" + this.state.month + ".json",  
                        data   : {apikey: "84f2dae5d3944f4c8e56a0c7b658eb49"},                    
                        success: this.onSuccess                     
                    })
                    
                }                
    
                //metoda se izvrsava nakon uspesnog instanciranja klase 'Page' a inicira ajax web api poziv
                componentDidUpdate(prevProps, prevState){
                    
                    //ako bilo koji od navedenih parametara nije definisan izadji napolje
                    if(!this.state.year || !this.state.month){
                        return;
                    }    

                    const oy = prevState.year;
                    const om = prevState.month;
                    const ny = this.state.year;
                    const nm = this.state.month;

                    //ako su trenutne vrednosti navedenih parametara identicne prethodnim, ne ponavljaj web api poziv
                    if(oy == ny && om == nm) {
                        return;
                    }
                    
                }
                
                //metoda se izvrsava nakon uspesnog izvrsenja web api poziva u componentDidMount
                onSuccess(responseData){
                    
                    //definise lokalniu niz 'webs'
                    let urls = [];
                    
                    //iterator iz prvog web api odgovora smesta linkove u niz 'webs' - kolekicja web linkova
                    for(var i = 0; i < 20; i++) {
                        const doc = responseData.response.docs[i];                                            
                        urls.push(doc);
                    }
                    
                    //lokalni niz smestamo u state kao bi bio dostupan u drugim komponentama                   
                    this.setState({'urls': urls});                    
                }
                
                years(){                    
                    let years = [];
                    for(var i = new Date().getFullYear() ; i >= 1851; i--) {
                        years.push(i);
                    }                    
                    return years;
                }
                
                //not used
                months(){                    
                    let months = [];
                    var mnth;
                    for(var i = 1 ; i < 13 ; i++) {                                                
                        months.push(i);
                    }                    
                    return months;
                }
                
                //render pakuje podatke nakon onSuccess (primer poziva f-je iz React-a)
                //ovde se definise dizajn web stranice                
                //value={this.state.selectValue}                 
                //{this.months().map((y) => <option key={y} value={y}>{y}</option>)}
                //<footer><div className="footer footer-t"></div></footer>
                render(){
                    return(
                        <section id="finder">
                            <div className="main">
                                <div>
                                    <form onSubmit={this.handleSubmit}>
                                        <select className="form-control"                                                   
                                                value={this.state.year} 
                                                onChange={this.handleChangeYear}>
                                                {this.years().map((y) => <option key={y} value={y}>{y}</option>)}
                                        </select>
                                        <select className="form-control"
                                                value={this.state.month}
                                                onChange={this.handleChangeMonth}>                          
                                                <option value="1">Jan</option>
                                                <option value="2">Feb</option>
                                                <option value="3">Mar</option>
                                                <option value="4">Apr</option>
                                                <option value="5">May</option>
                                                <option value="6">Jun</option> 
                                                <option value="7">Jul</option>
                                                <option value="8">Aug</option>
                                                <option value="9">Sep</option>
                                                <option value="10">Oct</option>
                                                <option value="11">Nov</option>
                                                <option value="12">Dec</option>
                                        </select>
                                        <input type="submit" value="Search News" className="btn" />
                                    </form>
                                </div>                                    
                            </div>
                            <div className="row">
                                <div className="col-content col-content-t ">    
                                    <Urls urls={this.state.urls} selectionHandler={this.handleClick} />  
                                </div>
                                <div className="col-details col-details-t ">
                                    {this.state.showDetail ? <UrlDetails url={this.state.selectedUrl} /> : null}  
                                </div>                                                                
                            </div>  
                            
                                         
                       
                              
                        </section> 
                                                 
                    )
                }
            }  

            //nezavisna f-ja van svih definisanih klasa
            //primer kako da se preko nezavisne f-je iz jedne klase 'Page' instancira druga klasa 'Image' i da se
            //tom prilikom prenesu parametri iz  pozivajuce u pozvanu klasu
            function Urls(props){
                return(
                    <div> 
                        {props.urls.map((url, index) =><Image key={index} url={url} clickHandler={props.selectionHandler} />)}
                    </div>
                );
            }
            
            //instancira je f-ja 'Urls', poziva drugi web api a vraca div u kome se nalaze title, image i description
            class Image extends React.Component{

                //konstruktor klase Image definise kako ce klasa biti instancirana
                //definisevarijable u kojim ace biti smestei podaci za svaki item iz drugogo web api-ja
                //impelmentira metodu onSuccess koja ce biti automatksi pozvana kada web api vrati success code             
                constructor(props){
                    super(props)
                    this.state = {
                        title: '',
                        description: '',
                        image: '',
                        url: ''
                    };                
                    this.onSuccess = this.onSuccess.bind(this);                                        
                }                                
                
                
                //metoda se izvrsava nakon uspesnog instanciranja klase 'Image' a inicira ajax web api poziv
               /* componentDidMount(){                
                    $.ajax({
                        type: 'GET',
                        url : 'http://api.linkpreview.net',  
                        data: {
                            'key': "5a9ae72a38ff6d9cf8646dc2531c8102f6fe6f3da2105", 
                            'q': this.props.url.web_url
                        },                          
                        success: this.onSuccess
                    });
                }
                */
                
                //metoda se izvrsava nakon uspesnog instanciranja klase 'Image' a inicira ajax web api poziv               
                componentDidMount(){                
                    $.ajax({
                        type: 'GET',
                        url : 'http://api.linkpreview.net',                          
                        data: {
                            'key': "123456", 
                            'q': "https://www.google.com"
                        },                          
                        success: this.onSuccess
                      });
                    }
                
                //metoda se izvrsava nakon uspesnog izvrsenja web api poziva u componentDidMount
                onSuccess(responseData){                
                    let title = responseData.title;
                    let description = responseData.description;
                    let image = responseData.image;
                    let url = responseData.url;
                    this.setState({'title': title, 'description': description, 'image': image, 'url': url});
                }

                //render pakuje podatke nakon onSuccess (primer poziva f-je iz React-a)
                render(){   
                    
                    const url = this.props.url;  
                    var tr = '';
                    console.log('url', url);
                    var myJSON = JSON.stringify(url);
                    console.log('url duzina', myJSON.length);
                    if (myJSON.length > 0){  
                        tr =
                            <div className="flex-container-4 flex-container-2">
                                <div>
                                    <div className="col-image-itself col-image-itself-t">
                                        <img className="col-img col-img-t" src={this.state.image} onClick={() => this.props.clickHandler(url)}/>
                                    </div>
                                    <div className="col-image-title col-image-title-t">{this.state.title}</div>          
                                    <div className="col-image-desc col-image-desc-t">{this.state.description}</div>    
                                </div>
                            </div>
                    }else{
                        tr =                         
                            <div>
                                <div className="col-image-itself col-image-itself-t">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" />
                                </div>
                                <div className="col-image-title col-image-title-t"></div>               
                                <div className="col-image-desc col-image-desc-t"></div>    
                            </div>                    
                    }                            
                    return tr;
                }

                                                                           
            }  

            const UrlDetails = (props) => {                
                const url = props.url;                
                return(
                    <div className="col-detail col-detail-t">                    
                        <div><b>Headline: </b>{url.headline.main}</div>
                        <div><b>Line: </b>{url.byline.original}</div>
                        <div><b>Publish date: </b>{url.pub_date}</div>
                        <div><b>Source: </b>{url.source}</div>
                        <div><b>Word count: </b>{url.word_count}</div>
                        <div><b>Url: </b><a href={url.web_url}>{url.headline.main}</a></div>
                    </div>
                );
            };

            ReactDOM.render(<Page />,  document.getElementById('root'));