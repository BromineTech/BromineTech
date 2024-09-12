
const messageObject = {
    route: null,
    issueId: null,
    milestoneId: null,
    temporaryId: null,
    field: null,
    isText: null, //yaha pe humlog bas text le rahe hai jaise praject name, description, (true ya false)
    text: null,   //milestone name ya uska description
    isActivity: null, //yaha pe jo database mein hai wo saari cheezein yaha pe hongi (true ya false)
    Activity: null,
    isAction: null, //yaha pe humlog wo saari cheezein update karenge jo nahi text hai nahi comment hai (true ya false)
    Action: null //   jaise link, issue banana ya assign karna , milestone banana aur milestone attach karna
                  //  target ya assign date change karna
  };
  
  export default messageObject;
  


