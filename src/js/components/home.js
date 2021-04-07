import {templates, select,} from './../settings.js';



class Home {
  constructor(wrapper){

    const thisHome = this;

    thisHome.render(wrapper);
    thisHome.initWidgets();
    thisHome.initActions();
    thisHome.navigate();
  }

  render(wrapper){
    const thisHome = this;

    const generatedHTML = templates.homeWidget();

    thisHome.dom = {};
    thisHome.dom.wrapper = wrapper;
    thisHome.dom.wrapper.innerHTML = generatedHTML;

  }

  initWidgets(){
    const thisHome = this;

    thisHome.element = document.querySelector(select.widgets.carousel);
    //eslint-disable-next-line no-undef
    thisHome.flkty = new Flickity (thisHome.element,{
      //options
      cellAlign: 'left',
      contain: true,
      autoPlay: true,
      prevNextButtons: false,
      wrapAround: true,
    });
  }

  initActions(){
    

  }

  navigate(){
  
  }
}

export default Home;