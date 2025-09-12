import {
    Button,
    Modal,
} from 'react-bootstrap'
import ReactPlayer from 'react-player'
import type { VariantItem } from '@/types/base'

export function LecturesVideoModal({ show, variant_item, playerRef, isPlaying, setIsPlaying, handleClose }: {
    show: boolean,
    variant_item: VariantItem | undefined,
    playerRef: React.RefObject<ReactPlayer | null>,
    isPlaying: boolean,
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>,
    handleClose: () => void
}) {
    return (
        <Modal show={show} size='lg' onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Lesson: {variant_item?.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ padding: 0 }}>
                <div style={{ width: '100%', aspectRatio: '16/9', background: '#000' }}>
                    {variant_item?.file && show && (
                        <ReactPlayer
                            ref={playerRef}
                            key={variant_item.id} // 使用key强制重新创建组件
                            url={String(variant_item.file)}
                            controls
                            playing={isPlaying}
                            width="100%"
                            height="100%"
                            onPause={() => setIsPlaying(false)}
                            onPlay={() => setIsPlaying(true)}
                            onEnded={() => setIsPlaying(false)}
                            onError={(error) => {
                                console.error('ReactPlayer error:', error);
                                setIsPlaying(false);
                            }}
                            config={{
                                file: {
                                    attributes: {
                                        preload: 'metadata'
                                    }
                                }
                            }}
                            stopOnUnmount={true}
                        />
                    )}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}