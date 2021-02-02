import React, { useState, useEffect } from "react"
import ErrorList from "../ErrorList"
import translateServerErrors from "../../services/translateServerErrors"
import getCurrentUser from "../../services/getCurrentUser"
import PodcastReviewForm from './PodcastReviewForm'
import ReviewTile from './ReviewTile.js'

const PodcastShowPage = (props) => {
  const [podcast, setPodcast] = useState({
    name: "",
    description: "",
    reviews: []
  })
  const [currentUser, setCurrentUser] = useState(undefined)
  const [errors, setErrors] = useState([])

  const { id: podcastId } = props.match.params

  const fetchCurrentUser = async () => {
    try {
      const user = await getCurrentUser()
      setCurrentUser(user)
    } catch (err) {
      setCurrentUser(null)
    }
  }

  const fetchPodcast = async () => {
    try {
      const response = await fetch(`/api/v1/podcasts/${podcastId}`)
      if (!response.ok) {
        throw new Error(`${response.status} (${response.statusText})`)
      }
      const body = await response.json()
      setPodcast(body.podcast)
    } catch (error) {
      console.error(error.message)
    }
  }

  const postPodcastReview = async (reviewPayload) => {
    try {
      const response = await fetch(`/api/v1/podcasts/${podcastId}/reviews`, {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json"
        }),
        body: JSON.stringify(reviewPayload)
      })
      if (!response.ok) {
        if (response.status === 422) {
          const body = await response.json()
          const newErrors = translateServerErrors(body.errors)
          return setErrors(newErrors)
        } else {
          const errorMessage = `${response.status} (${response.statusText})`
          const error = new Error(errorMessage)
          throw (error)
        }
      } else {
        const body = await response.json()
        setPodcast({
          ...podcast,
          reviews: [...podcast.reviews, body.review]
        })
      }
    } catch (error) {
      console.error(`Error in fetch: ${error.message}`)
    }
  }

  useEffect(() => {
    fetchPodcast()
    fetchCurrentUser()
  }, [])

  let submitNewReviewForm = ''
  if (currentUser) {
    submitNewReviewForm = (
      <div>
        <ErrorList errors={errors} />
        <PodcastReviewForm postReview={postPodcastReview} />
      </div>
    )
  }

  const reviews = podcast.reviews.map(review => {
    return (
      <ReviewTile
        key={review.id}
        review={review}
      />
    )
  })

  return (
    <div>
      <h1>{podcast.name}</h1>
      <p>{podcast.description}</p>
      {submitNewReviewForm}
      <div>
        {reviews}
      </div>
    </div>
  )
}

export default PodcastShowPage
