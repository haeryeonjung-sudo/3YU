import React, { useState, useRef } from 'react';
import { FamilyMediaItem, FamilyMember } from '../types';
import {
  Camera,
  Video,
  Upload,
  Heart,
  MessageCircle,
  Sparkles,
  MapPin,
  Calendar,
  Send,
  Plus,
  Trash2,
  Smile,
  Play,
} from 'lucide-react';

interface FamilyMediaGalleryProps {
  mediaItems: FamilyMediaItem[];
  members: FamilyMember[];
  activeMember: FamilyMember;
  onAddMedia: (media: Omit<FamilyMediaItem, 'id' | 'createdAt' | 'likes' | 'reactions' | 'comments'>) => void;
  onDeleteMedia: (mediaId: string) => void;
  onToggleLike: (mediaId: string) => void;
  onAddReaction: (mediaId: string, emoji: string) => void;
  onAddComment: (mediaId: string, text: string) => void;
}

export const FamilyMediaGallery: React.FC<FamilyMediaGalleryProps> = ({
  mediaItems,
  members,
  activeMember,
  onAddMedia,
  onDeleteMedia,
  onToggleLike,
  onAddReaction,
  onAddComment,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [selectedMemberId, setSelectedMemberId] = useState<string>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activeMediaForComments, setActiveMediaForComments] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  // Upload Modal State
  const [uploadType, setUploadType] = useState<'photo' | 'video'>('photo');
  const [mediaUrl, setMediaUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [mediaTag, setMediaTag] = useState<FamilyMediaItem['tag']>('daily');
  const [tagLabel, setTagLabel] = useState('학교&일상 🛹');
  const [previewError, setPreviewError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const TAG_OPTIONS: { tag: FamilyMediaItem['tag']; label: string; icon: string }[] = [
    { tag: 'study', label: '열공인증 📖', icon: '📖' },
    { tag: 'daily', label: '학교&일상 🛹', icon: '🛹' },
    { tag: 'food', label: '오늘의밥상 🍚', icon: '🍚' },
    { tag: 'memory', label: '가족추억 📹', icon: '📹' },
    { tag: 'pet', label: '반려동물 🐾', icon: '🐾' },
    { tag: 'cheer', label: '응원&서프라이즈 🎉', icon: '🎉' },
  ];

  const QUICK_SAMPLE_IMAGES = [
    {
      title: '스카 열공 📐',
      url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
      tag: 'study' as const,
      label: '열공인증 📖',
    },
    {
      title: '학교 운동장 ⚽',
      url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80',
      tag: 'daily' as const,
      label: '학교&일상 🛹',
    },
    {
      title: '맛있는 저녁 🥓',
      url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
      tag: 'food' as const,
      label: '오늘의밥상 🍚',
    },
    {
      title: '가족 카페 ☕',
      url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
      tag: 'memory' as const,
      label: '가족추억 📹',
    },
  ];

  // File Upload (Drag & Drop or File Picker with base64 conversion)
  const handleFileUpload = (file: File) => {
    if (!file) return;
    const isVideo = file.type.startsWith('video/');
    setUploadType(isVideo ? 'video' : 'photo');

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setMediaUrl(e.target.result as string);
        setPreviewError(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmitMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaUrl.trim() || !caption.trim()) return;

    onAddMedia({
      fromMemberId: activeMember.id,
      type: uploadType,
      url: mediaUrl.trim(),
      caption: caption.trim(),
      tag: mediaTag,
      tagLabel: tagLabel,
      date: new Date().toISOString().split('T')[0],
      location: location.trim() || undefined,
    });

    // Reset Form
    setMediaUrl('');
    setCaption('');
    setLocation('');
    setIsUploadModalOpen(false);
  };

  const handleSendComment = (mediaId: string) => {
    if (!commentText.trim()) return;
    onAddComment(mediaId, commentText.trim());
    setCommentText('');
  };

  const filteredMedia = mediaItems
    .filter((m) => (selectedTag === 'all' ? true : m.tag === selectedTag))
    .filter((m) => (selectedMemberId === 'all' ? true : m.fromMemberId === selectedMemberId))
    .sort((a, b) => b.createdAt - a.createdAt);

  const REACTION_EMOJIS = ['🔥', '💖', '🧋', '👏', '🤤', '✨', '💯'];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 rounded-3xl p-5 sm:p-6 border-2 border-slate-900 pop-shadow text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-xs font-black text-yellow-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>우리가족 프라이빗 사진 & 영상 갤러리</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display">
              오늘의 순간 포착 📸 피드
            </h2>
            <p className="text-xs sm:text-sm font-medium text-pink-100">
              스카 공부 인증샷, 학교 일상, 맛있는 식사, 짧은 영상을 가족끼리 실시간으로 나눠보세요!
            </p>
          </div>

          <button
            id="btn-open-upload-media"
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-3 bg-yellow-300 text-slate-900 rounded-2xl border-2 border-slate-900 font-black text-sm pop-shadow-sm pop-shadow-hover hover:bg-yellow-200 flex items-center gap-2 shrink-0 self-start md:self-auto"
          >
            <Camera className="w-4 h-4 stroke-[3]" />
            <span>사진/영상 올리기</span>
          </button>
        </div>
      </div>

      {/* Tag & Member Filter Bar */}
      <div className="space-y-2">
        {/* Category Tags */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedTag('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all shrink-0 ${
              selectedTag === 'all'
                ? 'bg-slate-900 text-white border-slate-900 pop-shadow-sm'
                : 'bg-white text-slate-700 border-slate-300 hover:border-slate-800'
            }`}
          >
            ✨ 전체 보기 ({mediaItems.length})
          </button>

          {TAG_OPTIONS.map((t) => (
            <button
              key={t.tag}
              onClick={() => setSelectedTag(t.tag)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all flex items-center gap-1 shrink-0 ${
                selectedTag === t.tag
                  ? 'bg-pink-500 text-white border-slate-900 pop-shadow-sm'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-slate-700'
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Member Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedMemberId('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all shrink-0 ${
              selectedMemberId === 'all'
                ? 'bg-slate-800 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-300'
            }`}
          >
            모든 가족
          </button>
          {members.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMemberId(m.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all flex items-center gap-1 shrink-0 ${
                selectedMemberId === m.id
                  ? 'border-slate-900 pop-shadow-xs font-black'
                  : 'border-slate-300 bg-white text-slate-600'
              }`}
              style={{
                backgroundColor: selectedMemberId === m.id ? m.bgLight : undefined,
              }}
            >
              <span>{m.avatar}</span>
              <span>{m.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Media Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredMedia.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl border-2 border-dashed border-slate-300 p-10 text-center space-y-3">
            <div className="text-4xl">📷</div>
            <h3 className="text-lg font-black text-slate-800">공유된 사진이나 영상이 없습니다</h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              오늘의 스카 공부 인증샷, 간식 사진, 짧은 동영상을 첫 번째로 공유해보세요!
            </p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2 bg-pink-500 text-white font-black text-xs rounded-xl border-2 border-slate-900 pop-shadow-sm inline-flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" /> 지금 업로드하기
            </button>
          </div>
        ) : (
          filteredMedia.map((item) => {
            const author = members.find((m) => m.id === item.fromMemberId) || activeMember;
            const isLiked = item.likes.includes(activeMember.id);
            const isCommentsOpen = activeMediaForComments === item.id;

            return (
              <div
                key={item.id}
                id={`media-card-${item.id}`}
                className="bg-white rounded-3xl border-2 border-slate-900 overflow-hidden pop-shadow flex flex-col"
              >
                {/* Author Bar */}
                <div className="p-3 sm:p-4 flex items-center justify-between border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xl p-1 rounded-lg border border-slate-800 bg-slate-50">
                      {author.avatar}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs sm:text-sm font-black text-slate-900">
                          {author.name}
                        </span>
                        {author.gradeBadge && (
                          <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 rounded-md font-bold text-slate-600 border border-slate-200">
                            {author.gradeBadge}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                        <span>{item.date}</span>
                        {item.location && (
                          <span className="flex items-center gap-0.5 text-pink-600">
                            <MapPin className="w-3 h-3" />
                            {item.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black px-2.5 py-1 bg-pink-100 text-pink-900 rounded-full border border-pink-300">
                      {item.tagLabel}
                    </span>
                    <button
                      onClick={() => onDeleteMedia(item.id)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                      title="삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Media Content (Image or Video) */}
                <div className="relative bg-slate-900 aspect-video sm:aspect-[4/3] flex items-center justify-center overflow-hidden group">
                  {item.type === 'video' ? (
                    item.url.includes('youtube.com') || item.url.includes('youtu.be') ? (
                      <iframe
                        src={
                          item.url.includes('embed')
                            ? item.url
                            : item.url.replace('watch?v=', 'embed/').replace('youtu.be/', 'www.youtube.com/embed/')
                        }
                        title={item.caption}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    ) : (
                      <video
                        src={item.url}
                        controls
                        className="w-full h-full object-contain"
                        poster="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80"
                      />
                    )
                  ) : (
                    <img
                      src={item.url}
                      alt={item.caption}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                    />
                  )}

                  {item.type === 'video' && (
                    <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[10px] font-bold flex items-center gap-1 border border-white/20">
                      <Video className="w-3 h-3 text-red-400" />
                      <span>동영상</span>
                    </div>
                  )}
                </div>

                {/* Caption & Details */}
                <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
                  <p className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed">
                    {item.caption}
                  </p>

                  {/* Reactions & Like Buttons */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    {/* Like & Comment Trigger */}
                    <div className="flex items-center gap-2">
                      <button
                        id={`btn-like-media-${item.id}`}
                        onClick={() => onToggleLike(item.id)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
                          isLiked
                            ? 'bg-rose-50 text-rose-600 border-rose-400'
                            : 'bg-white text-slate-600 border-slate-300 hover:border-rose-400'
                        }`}
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            isLiked ? 'fill-rose-500 text-rose-500' : ''
                          }`}
                        />
                        <span>{item.likes.length}</span>
                      </button>

                      <button
                        onClick={() =>
                          setActiveMediaForComments(
                            isCommentsOpen ? null : item.id
                          )
                        }
                        className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-white text-slate-600 border border-slate-300 hover:border-slate-500"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-blue-500" />
                        <span>댓글 {item.comments?.length || 0}</span>
                      </button>
                    </div>

                    {/* Quick Reaction Emojis */}
                    <div className="flex items-center gap-1">
                      {REACTION_EMOJIS.slice(0, 5).map((emoji) => {
                        const reaction = item.reactions.find((r) => r.emoji === emoji);
                        const hasReacted = reaction?.byMemberIds.includes(activeMember.id);
                        return (
                          <button
                            key={emoji}
                            onClick={() => onAddReaction(item.id, emoji)}
                            className={`px-1.5 py-0.5 text-xs rounded-lg border transition-all ${
                              hasReacted
                                ? 'bg-amber-100 border-amber-400 scale-110'
                                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                            }`}
                            title={`${emoji} 남기기`}
                          >
                            <span>{emoji}</span>
                            {reaction && reaction.byMemberIds.length > 0 && (
                              <span className="text-[10px] font-bold ml-0.5 text-slate-700">
                                {reaction.byMemberIds.length}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Comments Section */}
                  {isCommentsOpen && (
                    <div className="pt-3 border-t border-dashed border-slate-200 space-y-2">
                      <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                        {item.comments?.length === 0 && (
                          <p className="text-xs text-slate-400 text-center py-1">
                            가족의 첫 번째 댓글을 남겨보세요! 💬
                          </p>
                        )}
                        {item.comments?.map((comment) => {
                          const commenter = members.find((m) => m.id === comment.fromMemberId);
                          return (
                            <div
                              key={comment.id}
                              className="text-xs bg-slate-50 p-2 rounded-xl border border-slate-200 flex items-start gap-2"
                            >
                              <span>{commenter?.avatar || '👤'}</span>
                              <div className="flex-1">
                                <span className="font-black text-slate-800 mr-1">
                                  {commenter?.name || '가족'}:
                                </span>
                                <span className="text-slate-700">{comment.text}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Comment Input */}
                      <div className="flex items-center gap-1.5 pt-1">
                        <input
                          type="text"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleSendComment(item.id);
                            }
                          }}
                          placeholder="칭찬이나 감상 한마디 남기기..."
                          className="flex-1 px-3 py-1.5 text-xs bg-slate-50 rounded-xl border border-slate-300 focus:outline-none focus:border-slate-900"
                        />
                        <button
                          onClick={() => handleSendComment(item.id)}
                          className="px-2.5 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Upload Media Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-3xl border-2 border-slate-900 p-6 pop-shadow-lg max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📸</span>
                <div>
                  <h3 className="text-lg font-black text-slate-900">사진 & 영상 올리기</h3>
                  <p className="text-xs text-slate-500 font-bold">
                    열공 인증, 오늘 밥상, 일상 순간을 가족과 공유하세요
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="w-8 h-8 rounded-xl border-2 border-slate-900 flex items-center justify-center font-black text-slate-700 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Quick Sample Presets */}
            <div>
              <label className="text-xs font-black text-slate-700 block mb-1.5">
                ⚡ 1초 샘플 사진으로 바로 테스트
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {QUICK_SAMPLE_IMAGES.map((sample) => (
                  <button
                    type="button"
                    key={sample.title}
                    onClick={() => {
                      setMediaUrl(sample.url);
                      setUploadType('photo');
                      setMediaTag(sample.tag);
                      setTagLabel(sample.label);
                      setCaption(`${sample.title} 가족과 함께 공유해요! ✨`);
                    }}
                    className="p-1.5 rounded-xl border border-slate-300 hover:border-slate-900 text-left bg-slate-50 hover:bg-white transition-all text-xs"
                  >
                    <img
                      src={sample.url}
                      alt={sample.title}
                      className="w-full h-14 object-cover rounded-lg mb-1 border border-slate-200"
                    />
                    <span className="font-bold text-[11px] block truncate">{sample.title}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmitMedia} className="space-y-4">
              {/* Media Type Selector */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setUploadType('photo')}
                  className={`flex-1 py-2 rounded-xl border-2 text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                    uploadType === 'photo'
                      ? 'bg-slate-900 text-yellow-300 border-slate-900 pop-shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span>사진 (Photo)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setUploadType('video')}
                  className={`flex-1 py-2 rounded-xl border-2 text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                    uploadType === 'video'
                      ? 'bg-slate-900 text-yellow-300 border-slate-900 pop-shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  <Video className="w-4 h-4" />
                  <span>동영상 (Video)</span>
                </button>
              </div>

              {/* Drag & Drop or File Upload Box */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-400 hover:border-slate-900 rounded-2xl p-4 text-center cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={uploadType === 'video' ? 'video/*' : 'image/*'}
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                />
                <div className="flex flex-col items-center gap-1">
                  <Upload className="w-6 h-6 text-pink-500" />
                  <span className="text-xs font-black text-slate-800">
                    내 기기에서 사진/영상 파일 직접 선택 또는 드래그앤드롭
                  </span>
                  <span className="text-[10px] text-slate-500">
                    (모바일 카메라 촬영 사진이나 앨범 사진을 바로 넣을 수 있습니다)
                  </span>
                </div>
              </div>

              {/* Or Direct Image/Video URL */}
              <div>
                <label className="text-xs font-black text-slate-700 block mb-1">
                  또는 사진/영상 링크(URL) 직접 입력
                </label>
                <input
                  type="url"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="https://... 이미지 또는 MP4 동영상 URL"
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-50 rounded-xl border-2 border-slate-300 focus:outline-none focus:border-slate-900"
                />
              </div>

              {/* Preview Box */}
              {mediaUrl && (
                <div className="rounded-2xl border-2 border-slate-900 overflow-hidden bg-black max-h-48 flex items-center justify-center">
                  {uploadType === 'video' ? (
                    <video src={mediaUrl} controls className="max-h-48 w-full object-contain" />
                  ) : (
                    <img
                      src={mediaUrl}
                      alt="미리보기"
                      className="max-h-48 w-full object-contain"
                      onError={() => setPreviewError(true)}
                    />
                  )}
                </div>
              )}

              {/* Category Tag Picker */}
              <div>
                <label className="text-xs font-black text-slate-700 block mb-1">
                  카테고리 태그
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {TAG_OPTIONS.map((opt) => (
                    <button
                      type="button"
                      key={opt.tag}
                      onClick={() => {
                        setMediaTag(opt.tag);
                        setTagLabel(opt.label);
                      }}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all ${
                        mediaTag === opt.tag
                          ? 'bg-pink-500 text-white border-slate-900 pop-shadow-xs font-black'
                          : 'bg-slate-50 text-slate-700 border-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <span>{opt.icon}</span> {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Caption */}
              <div>
                <label className="text-xs font-black text-slate-700 block mb-1">
                  한줄 스토리 / 캡션
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="예: 오늘 스카 5시간 열공 완료! 모의고사 1등급 가자 🎧"
                  rows={2}
                  className="w-full px-3.5 py-2 text-xs font-bold bg-slate-50 rounded-xl border-2 border-slate-900 focus:outline-none focus:bg-white"
                  required
                />
              </div>

              {/* Location (Optional) */}
              <div>
                <label className="text-xs font-black text-slate-700 block mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-pink-500" />
                  <span>장소 (선택)</span>
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="예: 르하임 스터디카페 대치점, 집 주방"
                  className="w-full px-3 py-1.5 text-xs font-bold bg-slate-50 rounded-xl border border-slate-300 focus:outline-none focus:border-slate-900"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 rounded-xl border-2 border-slate-300 hover:bg-slate-100"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={!mediaUrl.trim() || !caption.trim()}
                  className="px-5 py-2 text-xs font-black text-white bg-slate-900 rounded-xl border-2 border-slate-900 pop-shadow-sm hover:bg-slate-800 disabled:opacity-50"
                >
                  피드에 올리기 ✨
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
