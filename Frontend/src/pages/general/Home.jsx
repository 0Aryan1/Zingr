import React, { useEffect, useState, useLayoutEffect, useRef } from 'react'
import axios from 'axios';
import '../../styles/reels.css'
import ReelFeed from '../../components/ReelFeed'
import API_URL from '../../config/api'

const Home = () => {
    const [ videos, setVideos ] = useState([])
    const hasRestoredRef = useRef(false)
    const scrollListenerRef = useRef(null)
    // Autoplay behavior is handled inside ReelFeed

    useEffect(() => {
        // Reset hasRestored flag when component mounts
        hasRestoredRef.current = false
        
        axios.get(`${API_URL}/api/food`, { withCredentials: true })
            .then(response => {

                console.log(response.data);

                setVideos(response.data.foods)
            })
            .catch(() => { /* noop: optionally handle error */ })
    }, [])

    // Restore scroll position IMMEDIATELY when videos load (before paint)
    useLayoutEffect(() => {
        if (videos.length > 0 && !hasRestoredRef.current) {
            const savedScrollPosition = sessionStorage.getItem('homeScrollPosition')
            console.log('Attempting to restore scroll position:', savedScrollPosition)
            if (savedScrollPosition) {
                const feedContainer = document.querySelector('.reels-feed')
                if (feedContainer) {
                    // Temporarily disable smooth scrolling for instant restore
                    const originalBehavior = feedContainer.style.scrollBehavior
                    feedContainer.style.scrollBehavior = 'auto'
                    
                    feedContainer.scrollTop = parseInt(savedScrollPosition, 10)
                    console.log('Restored scroll position:', savedScrollPosition)
                    
                    // Restore smooth scrolling after a brief delay
                    setTimeout(() => {
                        feedContainer.style.scrollBehavior = originalBehavior
                    }, 100)
                }
            }
            hasRestoredRef.current = true
        }
    }, [videos])

    // Save scroll position continuously and on unmount
    useEffect(() => {
        let isActive = true // Track if component is active
        
        const saveScrollPosition = () => {
            if (!isActive) return // Don't save if component is inactive
            
            const feedContainer = document.querySelector('.reels-feed')
            if (feedContainer) {
                const position = feedContainer.scrollTop
                sessionStorage.setItem('homeScrollPosition', position.toString())
                console.log('Saving scroll position:', position)
            }
        }

        // Set up scroll listener with throttling
        const feedContainer = document.querySelector('.reels-feed')
        if (feedContainer) {
            let timeoutId
            const throttledSave = () => {
                clearTimeout(timeoutId)
                timeoutId = setTimeout(saveScrollPosition, 200)
            }
            
            feedContainer.addEventListener('scroll', throttledSave, { passive: true })
            scrollListenerRef.current = { feedContainer, throttledSave }
        }

        // Save when component unmounts (navigating away)
        return () => {
            isActive = false // Mark as inactive
            saveScrollPosition()
            if (scrollListenerRef.current) {
                const { feedContainer, throttledSave } = scrollListenerRef.current
                feedContainer.removeEventListener('scroll', throttledSave)
            }
        }
    }, [videos])

    // Using local refs within ReelFeed; keeping map here for dependency parity if needed

    async function likeVideo(item) {

        const response = await axios.post(`${API_URL}/api/food/like`, { foodId: item._id }, {withCredentials: true})

        if(response.data.like){
            console.log("Video liked");
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: v.likeCount + 1 } : v))
        }else{
            console.log("Video unliked");
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: v.likeCount - 1 } : v))
        }
        
    }

    async function saveVideo(item) {
        const response = await axios.post(`${API_URL}/api/food/save`, { foodId: item._id }, { withCredentials: true })
        
        if(response.data.save){
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: v.savesCount + 1 } : v))
        }else{
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: v.savesCount - 1 } : v))
        }
    }

    return (
        <ReelFeed
            items={videos}
            onLike={likeVideo}
            onSave={saveVideo}
            emptyMessage="No videos available."
        />
    )
}

export default Home