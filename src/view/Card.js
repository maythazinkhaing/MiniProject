function Card(props) {
  return (
    <div className="card_container">
      <img src={props.image} alt="" className="card_img" />
      <h5 className="card_name"> {props.name} </h5>
    </div>
  );
}

export default Card;
