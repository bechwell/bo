var schema = {
  title: "Backoffice",
  menu: [
    {
      path: "",
      page: "home",
      component: "HomeComponent",
      title: "Accueil"
    },
    {
      path: "hotels",
      page: "hotels",
      title: "Hôtels"
    }
  ],
  pages: {
    home: {
      title: "Page accueil",
      type: "homepage"
    },
    hotels: {
      title: "Gestion des Hôtels",
      type: "crud",
      cols: {
        title: {
          title: "Titre",
          required: true,
          unique: true,
          type: "string",
          col: 10,
          flex: true
        },
        online: {
          title: "En Ligne",
          type: "bool",
          col: 2,
          position: "right",
          edit: true
        }
      }
    }
  }
};

export default schema;
