"use client"
import React, { useEffect, useState } from 'react'
import sass from '../../app.module.sass'
import { Loader, PlusCircle, Trash, X } from 'lucide-react'
import { useStore } from '@/useStore'
import { toast } from 'sonner'
import axios from 'axios'

const page = () => {
    const { route } = useStore();
    const [newCategoryModel, setNewCategoryModel] = useState(false);
    const [creating, setCreating] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState("");
    const fetchCategories = async () => {
        try {
            if (!loading) {
                setLoading(true);
                const { data } = await axios.get("/api/category/fetch");
                setCategories(data);
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            toast.error("Something went wrong.");
            setTimeout(() => {
                fetchCategories();
            }, 5000);
        }
    }
    useEffect(() => {
        fetchCategories();
    }, []);
    const newCategory = async (e) => {
        e.preventDefault();
        try {
            if (!creating) {
                const formdata = new FormData(e.target);
                if (formdata.get("name").trim().length > 2) {
                    setCreating(true);
                    const { data } = await axios.post("/api/category/create", formdata, {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    })
                    data.status ? [toast.success(data.msg), setNewCategoryModel(false), fetchCategories()] : toast.error(data.msg);
                    setCreating(false);
                } else {
                    toast.error("Category name is empty.");
                }
            }
        } catch (error) {
            setCreating(false);
            toast.error("Something went wrong.");
        }
    }
    const deleteCategory = async (id) => {
        try {
            if (deleting === "") {
                setDeleting(id);
                const formdata = new FormData();
                formdata.append("id", id);
                const { data } = await axios.post("/api/category/delete", formdata, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });
                if (data === 200) {
                    toast.success("Category successfully deleted.");
                    fetchCategories();
                } else {
                    toast.error("Something went wrong.");
                }
                setDeleting("");
            }
        } catch (error) {
            toast.error("Something went wrong.");
            setDeleting("");
        }
    }
    return (
        <>
            {
                newCategoryModel &&
                <div className={sass.overlay}>
                    <form onSubmit={newCategory}>
                        <div className={sass.header}>
                            <h2>New category</h2>
                            {!creating && <X onClick={() => { setNewCategoryModel(false) }} />}
                        </div>
                        <input type="text" placeholder='Name' name='name' autoComplete='off' />
                        <input type="submit" value={creating ? "Adding..." : "Add"} />
                    </form>
                </div>
            }
            <div className={sass.content}>
                <div className={sass.header}>
                    <h2>{loading && <Loader />} <span>{route.title}</span></h2>
                    <div className={sass.cta}>
                        <div className={sass.new} onClick={() => { setNewCategoryModel(true) }}>
                            <PlusCircle /> <span>Add new</span>
                        </div>
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <td>#</td>
                            <td>Name</td>
                            <td>Actions</td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            categories.map((e, i) => (
                                <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>{e.name}</td>
                                    <td><div className={`${sass.btn} ${!e.default && sass.delete} ${deleting === e.id && sass.loading}`} onClick={() => {
                                        if (!e.default) {
                                            if (deleting === "") {
                                                const ask = window.prompt(
                                                    `Are you sure you want to permanently delete the category "${e.name}"?\n\nThis action will also remove all items within this category.\n\nTo confirm, please type the category name below:`
                                                );
                                                if (ask === e.name) deleteCategory(e.id)
                                                else toast.error("Incorrect category name.");
                                            } else {
                                                toast.warning("Please wait while another category is deleting.");
                                            }
                                        } else {
                                            toast.error("You can't delete default categories.");
                                        }
                                    }}>{deleting === e.id ? <Loader /> : <Trash />}</div></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default page