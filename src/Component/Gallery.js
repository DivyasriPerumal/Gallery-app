// src/components/InfiniteScroll.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import './Gallery.css';

const Gallery = () => {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);


  const fetchArticles = async (page) => {
    
    try {
      setLoading(true);
      const response = await axios.get(`https://picsum.photos/v2/list?page=${page}`);
      const newArticles = response.data;
      setArticles(prevArticles => [...prevArticles, ...newArticles]);
    }
  catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    if (loading) return;
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading]);

  useEffect(() => {
    fetchArticles(currentPage);
  }, [currentPage]);
  
  const handleLike = (index) => {
    const updatedArticles = [...articles];
    updatedArticles[index].likeCount = (updatedArticles[index].likeCount || 0) + 1;
    setArticles(updatedArticles);
  };

  return (
    <div className="infinite-scroll-container">
     {articles.map((article, index) => (
      <div key={article.id} className="article">
         <div className="article-content">
        <img src={article.download_url} alt={`Article ${article.id}`} />
        <div className="author">Author: {article.author}</div>
        <div className="like-container">
          <FontAwesomeIcon
            icon={faThumbsUp}
            className="like-icon"
            onClick={() => handleLike(index)}
          />
          {article.likeCount > 0 &&( 
             <span className="like-count">{article.likeCount}</span>
          )}
         
        </div>
      </div>
      </div>
    ))}
    
    {loading && <p>Loading...</p>}
     
    </div>
  );
};

export default Gallery;
