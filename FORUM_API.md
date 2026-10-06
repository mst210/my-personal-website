# قرارداد API تالار گفتگو (باید در بک‌اند `/api` پیاده شود)

بک‌اند سایت (`/api`) در فایل zip نبود؛ فرانت‌اند کامل است و این endpointها را صدا می‌زند.
مجوزها: بخش جدید `forum` با actionهای view / add / edit / publish / delete (به catalog و preset نقش‌ها اضافه شود).
هر پاسخ موفق `{ok:true,...}` است و خطا `{error:"CODE"}`.

## عمومی (بدون لاگین)
- GET  /public/forum/settings → {settings:{categories,disclaimer,userReplies,open}}
- GET  /public/forum → {questions:[{id,title,category,authorName,createdAt,answerCount,doctorAnswered,pinned}]}  (فقط published؛ pinned اول، سپس جدیدترین)
- GET  /public/forum/:id → {question:{id,title,body,category,authorName,createdAt,closed}, answers:[{id,body,isDoctor,authorName,createdAt}]}

## کاربر لاگین‌کرده (Bearer idToken)
- POST /forum/questions {title,body,category,anonymous} → {pending:true|false}
  بررسی: banned، open، dailyLimit (RATE_LIMIT)، کلمات ممنوعه ⇒ pending؛ autoApprove ⇒ published. authorName اگر anonymous بود «کاربر ناشناس».
- POST /forum/questions/:id/answers {body} → {pending}   (QUESTION_CLOSED / userReplies=false ⇒ خطا)
- POST /forum/reports {questionId,targetType:"question|answer",targetId,reason}

## ادمین (مجوز forum.*)
- GET  /admin/forum/stats → {pending,published,unanswered,reports}
- GET  /admin/forum/settings | PUT → {open,autoApprove,userReplies,categories[],blockedWords[],disclaimer,dailyLimit,bannedUids[]}
- GET  /admin/forum/questions?status=pending|published|rejected|hidden → {questions[]} (شامل uid, status, answerCount, anonymous)
- GET  /admin/forum/questions/:id → {question, answers[]}
- PUT  /admin/forum/questions/:id {status?,title?,body?,category?,pinned?,closed?}   (تغییر status نیازمند forum.publish؛ بقیه forum.edit)
- DELETE /admin/forum/questions/:id (+ پاسخ‌ها) → forum.delete
- POST /admin/forum/questions/:id/answers {body} → پاسخ با isDoctor:true (forum.add)
- DELETE /admin/forum/questions/:qid/answers/:aid
- PUT  /admin/forum/ban {uid,banned}
- GET  /admin/forum/reports → {reports:[{id,questionId,targetType,targetId,preview,reason,createdAt}]} (فقط باز)
- PUT  /admin/forum/reports/:id {resolved:true}

## ساختار Firestore پیشنهادی
forum_questions/{id} (+ زیرکالکشن answers/{aid}), forum_reports/{id}, forum_settings/main
در ثبت متن‌ها فقط plain text بپذیرید و طول را محدود کنید (فرانت‌اند با textContent نمایش می‌دهد).
