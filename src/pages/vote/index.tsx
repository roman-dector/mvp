import { useNavigate, useParams } from "react-router-dom"
import {
  getFirestore,
  doc,
  collection,
  updateDoc,
} from "firebase/firestore"
import {
  useDocument,
  useCollection,
} from "react-firebase-hooks/firestore"

import s from "./styles.module.css"
import { useEffect, useState } from "react"
import { firebaseApp } from "../login/ui/firebase"
import { Film } from "../../entities/film"

type Session = {
  start: number
  end: number
  films: string[]
}

type Result = Record<string, number>

export const VotePage = () => {
  const { sessionId } = useParams()

  const [rating, setRating] = useState<number>(0)

  const [sessionInfo, setSessionInfo] = useState<Session>()

  const [filmsInfo, setFilmsInfo] = useState<Film[]>()

  const [result, setResult] = useState<Result>({})

  const [currentFilmIdx, setCurrentFilmIdx] = useState(0)

  const [finished, setFinished] = useState(false)

  const [session] = useDocument(
    doc(getFirestore(firebaseApp), "session", sessionId as string),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  )

  const [films] = useCollection(
    collection(getFirestore(firebaseApp), "film"),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  )

  useEffect(() => {
    if (!session) {
      return
    }

    const sessionData = session.data()
    setSessionInfo(sessionData as Session)
  }, [session])

  useEffect(() => {
    if (!films || !sessionInfo) {
      return
    }

    setFilmsInfo(
      films.docs
        .map(f => f.data())
        .filter(({ id }) => sessionInfo.films.includes(id)) as Film[]
    )
  }, [films, sessionInfo])

  const onButtonClick = () => {
    if (!filmsInfo || !sessionInfo) {
      return
    }

    setResult(res => ({
      ...res,
      [filmsInfo[currentFilmIdx].id]: rating,
    }))

    setCurrentFilmIdx(v => v + 1)
    setRating(0)
  }

  useEffect(() => {
    if (!filmsInfo || !sessionInfo || !films) {
      return
    }

    if (currentFilmIdx === filmsInfo.length && !finished) {
      films.docs
        .filter(d => sessionInfo.films.includes(d.id))
        .forEach(d => {
          const currentRating = d.data().ratingValue
          const currentReviews = d.data().reviewCount

          updateDoc(d.ref, {
            ratingValue: currentRating + result[d.id],
            reviewCount: currentReviews + 1,
          })
        })

      setFinished(true)
    }
  }, [
    currentFilmIdx,
    rating,
    sessionInfo,
    filmsInfo,
    films,
    result,
    finished,
  ])

  if (currentFilmIdx === filmsInfo?.length) {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>Спасибо за ваш голос!</h1>
        </div>
      </div>
    )
  }

  return (
    filmsInfo && (
      <div className={s.root}>
        <div className={s.container}>
          <h1>{filmsInfo[currentFilmIdx].name}</h1>

          <img
            className={s.poster}
            src={filmsInfo[currentFilmIdx].posterSrc}
          />

          <div className={s.rating}>
            {Array(10)
              .fill(null)
              .map((_, idx) => (
                <div
                  className={`${s.circle} ${
                    rating >= idx + 1 ? s.circleChecked : ""
                  }`}
                  onClick={() => setRating(idx + 1)}
                />
              ))}
          </div>

          <button onClick={onButtonClick}>Проголосовать</button>
        </div>
      </div>
    )
  )
}
