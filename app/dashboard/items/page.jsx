"use client"
import { Check, Loader, Pen, Plus, PlusCircle, ScanText, Trash, X } from 'lucide-react'
import sass from '../../app.module.sass'
import React, { useEffect, useRef, useState } from 'react'
import { useStore } from '@/useStore'
import Price from '@/components/Price'
import { toast } from 'sonner'
import axios from 'axios'

const page = () => {
    const boxRef = useRef(null);
    const { route } = useStore();
    const [loading, setLoading] = useState(true);
    const [loadingCat, setLoadingCat] = useState(false);
    const [priceInput, setPriceInput] = useState([]);
    const [newItemModel, setNewItemModel] = useState(false);
    const [editItemModel, setEditItemModel] = useState({});
    const [_number, setNumber] = useState("");
    const [adding, setAdding] = useState(false);
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [skip, setSkip] = useState(0);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [inStock, setInStock] = useState("both");
    const [deleteItemId, setDeleteItemId] = useState("");
    const [checkInStock, setCheckInStock] = useState(true);
    useEffect(() => {
        const div = boxRef.current;
        const handleScroll = () => {
            if (!div) return;
            const { scrollTop, scrollHeight, clientHeight } = div;
            if (scrollTop + clientHeight >= scrollHeight - 5 && !loading) {
                setSkip((e) => e += 20);
            }
        };
        div?.addEventListener("scroll", handleScroll);
        return () => div?.removeEventListener("scroll", handleScroll);
    }, [loading]);
    useEffect(() => {
        if (skip) fetchItems(skip, search, category, inStock);
    }, [skip]);
    useEffect(() => {
        setItems([]);
        setSkip(0);
        fetchItems(0, search, category, inStock);
    }, [category, inStock]);
    const fetchCategories = async () => {
        try {
            if (!loadingCat) {
                setLoadingCat(true);
                const { data } = await axios.get("/api/category/fetch");
                setCategories(data);
                setLoadingCat(false);
            }
        } catch (error) {
            setLoadingCat(false);
            toast.error("Something went wrong.");
            setTimeout(() => {
                fetchCategories();
            }, 5000);
        }
    }
    useEffect(() => {
        fetchCategories();
    }, []);
    const fetchItems = async (e, s, c, i) => {
        try {
            setLoading(true);
            const formdata = new FormData();
            formdata.append("skip", e);
            formdata.append("search", s);
            formdata.append("category", c);
            formdata.append("stock", i);
            const { data } = await axios.post("/api/item/fetch", formdata, {
                header: {
                    "Content-Type": "multipart/form-data"
                }
            });
            setLoading(false);
            setItems((prev) => [...prev, ...data]);
        } catch (error) {
            toast.error("Something went wrong.");
            setLoading(false);
        }
    }
    const newItem = async (e, r) => {
        e.preventDefault();
        try {
            if (!adding) {
                setAdding(true);
                const formdata = new FormData(e.target);
                formdata.append("role", r);
                formdata.append("id", editItemModel._id);
                formdata.append("stock", checkInStock);
                const { data } = await axios.post("/api/item/create", formdata, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });
                data.status === 200 ? [toast.success(data.msg), e.target.reset(), setNumber(""), setPriceInput([]), setSkip(0), setItems([]), fetchItems(0, "", "all", "both"), setSearch(""), setCategory("all"), setInStock("both"), setEditItemModel(false)] : toast.error(data.msg);
                setAdding(false);
            }
        } catch (error) {
            setAdding(false);
            toast.error("Something went wrong.");
        }
    }
    const deleteItem = async (id) => {
        try {
            const formdata = new FormData();
            formdata.append("id", id);
            const { data } = await axios.post("/api/item/delete", formdata, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            if (data === 200) {
                toast.success("Item successfully deleted.");
                setPriceInput([]);
                setSkip(0);
                setItems([]);
                fetchItems(0, "", "all", "both");
                setSearch("");
                setCategory("all");
                setInStock("both");
            } else {
                toast.error("Something went wrong.");
            }
            setDeleteItemId("");
        } catch (error) {
            toast.error("Something went wrong.");
            setDeleteItemId("");
        }
    }
    return (
        <>
            {
                newItemModel &&
                <div className={sass.overlay}>
                    <form onSubmit={(e) => { newItem(e, "new") }}>
                        <div className={sass.header}>
                            <h2>New item</h2>
                            {!adding && <X onClick={() => { setNewItemModel(false); setNumber(""); setPriceInput([]) }} />}
                        </div>
                        <div className={sass.newf}>
                            <div className={sass.btn} onClick={() => { setCheckInStock(!checkInStock) }}>{checkInStock && <Check />}</div>
                            <input type="text" placeholder='Name' name='name' autoComplete='off' />
                        </div>
                        <select name='category'>
                            <option value="" hidden>Select category</option>
                            {
                                categories.map((e, i) => (
                                    <option key={i} value={e.id}>{e.name}</option>
                                ))
                            }
                        </select>
                        {
                            priceInput.length > 1 ?
                                priceInput.map((_, i) => (
                                    <Price number={i} setPriceInput={setPriceInput} limit={priceInput.length} key={i} />
                                ))
                                :
                                <div className={sass.newf}>
                                    <input type="text" placeholder='Price' style={{ maxWidth: "100%" }} name='price' value={_number} autoComplete='off' onInput={(e) => {
                                        const value = e.target.value.trim().slice(0, 6);
                                        setNumber(/^[0-9]*$/.test(value) ? value : "");
                                    }} />
                                    <div className={sass.btn} onClick={() => { setPriceInput((prev) => [...prev, "", ""]) }}><Plus /></div>
                                </div>
                        }
                        <input type="submit" value={adding ? "Adding..." : "Add"} />
                    </form>
                </div>
            }
            {
                Object.keys(editItemModel).length ?
                    <div className={sass.overlay}>
                        <form onSubmit={(e) => { newItem(e, "edit") }}>
                            <div className={sass.header}>
                                <h2>Edit item</h2>
                                {!adding && <X onClick={() => { setEditItemModel({}); setNumber(""); setPriceInput([]) }} />}
                            </div>
                            <div className={sass.newf}>
                                <div className={sass.btn} onClick={() => { setCheckInStock(!checkInStock) }}>{checkInStock && <Check />}</div>
                                <input type="text" placeholder='Name' name='name' defaultValue={editItemModel.name} autoComplete='off' />
                            </div>
                            <select name='category' value={editItemModel.cid}>
                                {
                                    categories.map((e, i) => (
                                        <option key={i} value={e.id}>{e.name}</option>
                                    ))
                                }
                            </select>
                            {
                                priceInput.length ?
                                    priceInput.map((_, i) => (
                                        <Price number={i} setPriceInput={setPriceInput} limit={priceInput.length} key={i} priceInput={priceInput[i]} />
                                    ))
                                    :
                                    <div className={sass.newf}>
                                        <input type="text" style={{ maxWidth: "100%" }} placeholder='Price' name='price' value={_number} autoComplete='off' onInput={(e) => {
                                            const value = e.target.value.trim().slice(0, 6);
                                            setNumber(/^[0-9]*$/.test(value) ? value : "");
                                        }} />
                                        <div className={sass.btn} onClick={() => { setPriceInput((prev) => [...prev, "", ""]) }}><Plus /></div>
                                    </div>
                            }
                            <input type="submit" value={adding ? "Saving..." : "Save"} />
                        </form>
                    </div> : <></>
            }
            <div ref={boxRef} className={sass.content}>
                <div className={sass.header}>
                    <h2>{loading && <Loader />} <span>{route.title}</span></h2>
                    <div className={sass.helper}>
                        <div className={sass.search}>
                            <input type="text" placeholder='Search & hit enter' value={search} onChange={(e) => { setSearch(e.target.value) }} onKeyDown={(e) => { if (e.key === "Enter") { setItems([]); setSkip(0); fetchItems(0, search, category, inStock); } }} />
                            {search.length ? <X style={{ cursor: "pointer" }} onClick={() => { setSearch(""); setItems([]); setSkip(0); fetchItems(0, "", category, inStock); }} /> : <ScanText />}
                        </div>
                        <div className={sass.filter}>
                            <div className={sass.col}>
                                <p>Category:</p>
                                <select value={category} onChange={(e) => { setCategory(e.target.value) }}>
                                    <option value="all">All</option>
                                    {
                                        categories.map((e, i) => (
                                            <option key={i} value={e.id}>{e.name}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className={sass.col}>
                                <p>InStock:</p>
                                <select value={inStock} onChange={(e) => { setInStock(e.target.value) }}>
                                    <option value="both">Both</option>
                                    <option value="true">True</option>
                                    <option value="false">False</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className={sass.cta}>
                        {
                            loadingCat ?
                                <div className={sass.new} onClick={(e) => { e.preventDefault(); toast.warning("Please wait a moment.") }}>
                                    <Loader className={sass.svgloading} /> <span>Add new</span>
                                </div> :
                                <div className={sass.new} onClick={() => { setNewItemModel(true); setCheckInStock(true) }}>
                                    <PlusCircle /> <span>Add new</span>
                                </div>
                        }
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <td>#</td>
                            <td>Name</td>
                            <td>Price</td>
                            <td>Category</td>
                            <td>InStock</td>
                            <td>Actions</td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            items.map((e, i) => (
                                <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>{e.name}</td>
                                    <td style={{ minWidth: "200px" }}>{
                                        typeof e.price === "number" ? e.price :
                                            e.price.map((p, j) => (
                                                <span key={j}><b>{p.label}</b>: {p.price} </span>
                                            ))
                                    } Rs
                                    </td>
                                    <td>{e.category}</td>
                                    <td>{e.inStock ? <span className={sass.true}>True</span> : <span className={sass.false}>False</span>}</td>
                                    <td><div className={sass.cta}><div className={`${sass.btn} ${sass.delete} ${e._id === deleteItemId && sass.loading}`}
                                        onClick={
                                            () => {
                                                if (deleteItemId === "") {
                                                    const ask = window.confirm(
                                                        `Are you sure you want to delete "${e.name}" from the "${e.category}" category?\n\nThis action cannot be undone.`
                                                    );
                                                    if (ask) { deleteItem(e._id); setDeleteItemId(e._id) }
                                                } else {
                                                    toast.warning("Please wait while another item is deleting.");
                                                }
                                            }
                                        }
                                    >{e._id === deleteItemId ? <Loader /> : <Trash />}</div><div className={`${sass.btn}`} onClick={() => { setEditItemModel(e); setCheckInStock(e.inStock); if (typeof e.price === "number") { setNumber(e.price) } else { setPriceInput(e.price) } }}><Pen /></div></div></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div >
        </>
    )
}

export default page