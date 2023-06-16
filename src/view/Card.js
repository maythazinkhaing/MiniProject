function Card(props) {
  return (
    <div className="card_container">
      <img src={props?.image} alt="" width={50} height={50} />
      <h3> {props.name} </h3>
    </div>
  );
}

export default Card;
