import styles from "./styles.module.scss";
import loader from "../../images/loader.gif";

const Loader = () => {
  return (
    <div className={styles.wrapper} >
      <img src={loader} />
      <label aria-label="loading">Loading...</label>
    </div>
  );
};

export default Loader;
