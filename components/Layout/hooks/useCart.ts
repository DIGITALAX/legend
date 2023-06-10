import { useState } from "react";

const useCart = () => {

    const [cartOpen, setCartOpen] = useState<boolean>(false);


    return {cartOpen, setCartOpen}
}

export default useCart;