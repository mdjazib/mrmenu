"use client"
import React, { useEffect, useState } from 'react'
import sass from '../../app.module.sass'
import { Loader, Pen, Plus, PlusCircle, Trash, X } from 'lucide-react'
import { useStore } from '@/useStore'
import Item from '@/components/Item'
import { toast } from 'sonner'
import axios from 'axios'

const page = () => {
    const { route } = useStore();
    const [newDealModal, setNewDealModal] = useState(false);
    const [items, setItems] = useState([]);
    const [price, setPrice] = useState([]);
    const [total, setTotal] = useState(0);
    const [priceInput, setPriceInput] = useState("");
    const [saveRupees, setSaveRupees] = useState(0);
    const [adding, setAdding] = useState(false);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState("");
    const [deals, setDeals] = useState([]);
    const newdeal = async (e) => {
        e.preventDefault();
        try {
            if (name.trim().length) {
                if (name.trim().length > 50) {
                    toast.error("Deal name is too long.");
                } else {
                    if (!adding) {
                        if (priceInput > total / 2) {
                            setAdding(true);
                            const formdata = new FormData(e.target);
                            formdata.append("benifit", saveRupees);
                            const { data } = await axios.post("/api/deal/create", formdata, {
                                headers: {
                                    "Content-Type": "multipart/form-data"
                                }
                            })
                            if (data.status === 200) {
                                setSaveRupees(0);
                                setName("");
                                setItems([]);
                                setTotal(0);
                                setPrice([]);
                                setPriceInput("");
                                setNewDealModal(false);
                                e.target.reset();
                                toast.success(data.msg);
                                fetchDeals();
                            } else {
                                toast.error(data.msg);
                            }
                            setAdding(false);
                        } else {
                            toast.error("Deal price is too low.");
                        }
                    }
                }
            } else {
                toast.error("Deal name can't be empty.");
            }
        } catch (error) {
            toast.error("Something went wrong.");
            setAdding(false);
        }
    }
    const fetchDeals = async () => {
        try {
            setLoading(true);
            const { data } = await axios.post("/api/deal/fetch");
            setLoading(false);
            setDeals(data);
        } catch (error) {
            toast.error("Something went wrong.");
        }
    }
    useEffect(() => {
        const sum = (a, b) => { return a + b };
        setTotal(price.length ? price.map(e => Number(e?.total)).reduce(sum) : 0);
    }, [price]);
    useEffect(() => {
        setSaveRupees(total - priceInput);
    }, [priceInput, total]);
    useEffect(() => {
        fetchDeals();
    }, []);
    return (
        <>
            {
                newDealModal &&
                <div className={sass.overlay}>
                    <form onSubmit={newdeal} style={{ maxWidth: "600px" }}>
                        <div className={sass.header}>
                            <h2>New deal</h2>
                            {<X onClick={() => { setNewDealModal(false); setPriceInput("") }} />}
                        </div>
                        <div className={sass.newf}>
                            <div className={sass.btn} onClick={() => { items.length < 6 ? setItems((prev) => [...prev, ""]) : toast.error("You can't add more than 6 items in a single deal.") }}><Plus /></div>
                            <input type="text" placeholder='Name' name='name' autoComplete='off' value={name} onChange={(e) => { setName(e.target.value) }} />
                            <input type="text" placeholder='Price' name='price' value={priceInput} onChange={(e) => {
                                if (/^[0-9]*$/.test(e.target.value) && e.target.value.length <= 5) {
                                    if (e.target.value < total) {
                                        setPriceInput(e.target.value);
                                    } else {
                                        toast("Deal price must be less than the total rupees.");
                                    }
                                }
                            }} autoComplete='off' />
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Item</th>
                                    <th>Quantity</th>
                                    <th>Unit price</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    items.map((e, i) => (
                                        <Item key={i} number={i} setItems={setItems} items={items} setPrice={setPrice} price={price} setPriceInput={setPriceInput} setSaveRupees={setSaveRupees} />
                                    ))
                                }
                                {
                                    !items.length &&
                                    <tr>
                                        <td colSpan={5}>Deal is empty now.</td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                        <table>
                            <tr><th>Total in Rupees</th><td>{total}</td></tr>
                            <tr><th>Customer benifit in Rupees</th><td>{saveRupees}</td></tr>
                        </table>
                        <input type="submit" value={adding ? "Adding..." : "Add"} />
                    </form>
                </div>
            }
            <div className={sass.content} style={{ paddingBottom: "20px" }}>
                <div className={sass.header}>
                    <h2>{loading && <Loader />} <span>{route.title}</span></h2>
                    <div className={sass.cta}>
                        <div className={sass.new} onClick={() => { setNewDealModal(true) }}>
                            <PlusCircle /> <span>Add new</span>
                        </div>
                    </div>
                </div>
                <div className={sass.deals}>
                    {
                        deals.map((e, i) => (
                            <div key={i} className={sass.deal}>
                                <div className={sass.dheader}>
                                    <h2>{e.name}</h2>
                                    <div className={sass.col}>
                                        <h3>{e.price} Rs</h3>
                                        <p>Save Rs. {e.save}</p>
                                    </div>
                                </div>
                                <div className={sass.items}>
                                    {
                                        e.items.map((item, j) => (
                                            <div key={j} className={sass.item}>{item.name} <span>{item.quantity} x {item.price} Rs</span></div>
                                        ))
                                    }
                                </div>
                                <div className={sass.cta}>
                                    <div className={`${sass.btn} ${sass.delete}`}><Trash /><span>Delete</span></div>
                                    <div className={sass.btn}><Pen /><span>Edit</span></div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </>
    )
}

export default page